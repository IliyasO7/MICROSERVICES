import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, default: null, required: true },
    accountNumber: { type: Number, default: null, required: true },
    ifscCode: { type: String, default: null, required: true },
    bankDocument: { type: String, default: null },
    cancelledCheque: { type: String, default: null },
    isDefault: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
  },
  {
    timestamp: true,
  }
);

const Bank = mongoose.model('bank', schema);

export default Bank;
