import mongoose from 'mongoose';
import { ObjectId } from '../utils/helper.js';

export const PaymentProvider = {
  RAZORPAY: 'razorpay',
  PAYU: 'payu',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
};

const schema = new mongoose.Schema(
  {
    provider: { type: String, enum: Object.values(PaymentProvider) },
    orderId: { type: String, default: null },
    paymentId: { type: String, default: null },
    referenceId: { type: String },
    user: { type: ObjectId, ref: 'user' },
    mode: { type: String },
    amount: { type: Number },
    feeAmount: { type: Number },
    taxAmount: { type: Number },
    settledAmount: { type: Number },
    paidAt: { type: Number },
    settledAt: { type: Number },
    status: {
      type: String,
      default: PaymentStatus.PENDING,
      enum: Object.values(PaymentStatus),
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('payment', schema);

export default Payment;
