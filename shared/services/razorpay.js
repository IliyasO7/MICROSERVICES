import RazorPay from 'razorpay';
import Payment, { PaymentStatus } from '../models/payment.js';

export const razorpay = new RazorPay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createPaymentOrder = async ({ userId, amount }) => {
  const order = await razorpay.orders.create({
    currency: 'INR',
    amount: amount * 100,
  });

  const payment = await Payment.create({
    orderId: order.id,
    user: userId,
    amount,
  });

  return payment.toJSON();
};

export const verifyPayment = async ({
  userId,
  orderId,
  paymentId,
  paymentSignature,
}) => {
  try {
    const [data, payment] = await Promise.all([
      Payment.findOne({ user: userId, orderId }),
      razorpay.payments.fetch(paymentId),
    ]);

    if (!data) return ['payment does not exist', null];
    if (data.status !== PaymentStatus.PENDING)
      return ['payment already processed', null];
    if (payment.status !== 'captured') return ['payment is not captured', null];

    Object.assign(data, {
      paymentId: payment.id,
      method: payment.method,
      feeAmount: payment.fee * 100,
      taxAmount: payment.tax * 100,
      settledAmount: payment.amount - payment.fee * 100,
      paidAt: new Date(payment.created_at * 1000),
      status: PaymentStatus.PAID,
    });

    await data.save();

    return [null, data.toJSON()];
  } catch (err) {
    if (err.error?.code == 'BAD_REQUEST_ERROR')
      return ['payment id does not exist', null];
    throw err;
  }
};
