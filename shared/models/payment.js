import mongoose from 'mongoose';

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
};

const schema = new mongoose.Schema(
  {
    orderId: { type: String, default: null },
    paymentId: { type: String, default: null },
    mode: { type: String },
    amount: { type: Number },
    feeAmount: { type: Number },
    taxAmount: { type: Number },
    settledAmount: { type: Number }, // fee - tax amount
    status: {
      type: String,
      default: PaymentStatus.PENDING,
      enum: Object.values(PaymentStatus),
    }, //returns an array of Strings
  },
  {
    timestamp: true,
  }
);

const Payment = mongoose.model('payment', schema);

export default Payment;
