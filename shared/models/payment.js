import mongoose from 'mongoose';
import { ObjectId } from '../utils/helper.js';

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
};

const schema = new mongoose.Schema(
  {
    orderId: { type: String, default: null },
    paymentId: { type: String, default: null },
    user: { type: ObjectId, ref: 'user' },
    method: { type: String },
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
    timestamp: true,
  }
);

const Payment = mongoose.model('payment', schema);

export default Payment;
