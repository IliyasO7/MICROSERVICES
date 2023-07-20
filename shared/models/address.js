import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    address: { type: String, default: null, required: true },
    city: { type: String, default: null, required: true },
    state: { type: String, default: null, required: true },
    pincode: { type: String, default: null, required: true },
    country: { type: String, default: null, required: true },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const Address = mongoose.model('address', schema);

export default Address;
