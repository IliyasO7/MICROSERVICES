import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String },
    accountNo: { type: Number },
    ifscCode: { type: String },
    document: { type: String, default: null },
    cancelledCheque: { type: String, default: null },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Bank = mongoose.model('bank', schema);

export default Bank;
