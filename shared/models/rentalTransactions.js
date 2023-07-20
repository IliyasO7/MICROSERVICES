import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'booking',
      required: true,
    },
    transactionType: { type: String, default: null }, //RENT TOKEN SD
    transactionFor: {
      type: String,
      default: null,
      enum: ['RENT', 'SERVICE', 'TOKEN', 'SECUIRITY'],
    },
    transactionId: { type: String, default: null },
    paymentDate: { type: Date, default: null },
    paidFrom: { type: Date, required: true },
    paidUntil: { type: Date, required: true },
    amount: { type: Number, default: null },
    gateway: { type: String, default: null },
    mode: { type: String, default: null },
    status: {
      type: String,
      default: 'PENDING',
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
    },
  },
  {
    timestamp: true,
  }
);
const rentalTransactions = mongoose.model('rentalTransactions', schema);

export default rentalTransactions;
