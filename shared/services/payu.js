import qs from 'qs';
import crypto from 'crypto';
import Payment, { PaymentStatus } from '../models/payment.js';
import cryptoRandomString from 'crypto-random-string';
import { error } from 'console';

export const createPaymentOrder = async ({
  name,
  email,
  mobile,
  userId,
  referenceId,
  product = 'order',
  amount,
  callbackUrl,
  redirectUrl,
}) => {
  const payment = await Payment.create({
    orderId: cryptoRandomString({
      type: 'hex',
      length: 10,
    }),
    referenceId,
    amount,
    user: userId,
  });

  const input = [
    process.env.PAYU_KEY,
    payment._id.toString(),
    amount,
    product,
    name,
    email,
    userId,
    redirectUrl,
    '|||||||',
    process.env.PAYU_SALT,
  ].join('|');

  const hash = crypto.createHash('sha512').update(input).digest('hex');

  const query = qs.stringify({
    name,
    email,
    mobile,
    userId,
    product,
    hash,
    callbackUrl,
    redirectUrl,
  });

  return {
    ...payment.toJSON(),
    url: `${process.env.BASE_URL}/customer/payments/${payment._id}/payu-checkout?${query}`,
  };
};

export const verifyPayment = async (body, fields = {}) => {
  const payment = await Payment.findOne({ _id: body.txnid, user: body.udf1 });

  const query = {
    status: body.status,
    message: body.error_Message,
    ...fields,
  };

  const response = () => ({
    success: query.status === 'success' ? true : false,
    data: payment,
    error: query.message,
    redirectUrl: body.udf2 + '?' + qs.stringify(query),
  });

  if (!payment) {
    Object.assign(query, {
      status: 'failure',
      message: 'payment id does not exist',
    });
    return response();
  }

  if (payment.status === PaymentStatus.PAID) {
    Object.assign(query, {
      status: 'failure',
      message: 'payment already processed',
    });
    return response();
  }

  if (body.status === 'success') {
    payment.paymentId = body.mihpayid;
    payment.mode = body.mode.toLowerCase();
    payment.paidAt = new Date(body.addedon);
    payment.status = PaymentStatus.PAID;

    await payment.save();
  }

  return response();
};
