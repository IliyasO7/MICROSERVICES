import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    fname: { type: String },
    lname: { type: String },
    mobile: { type: String },
    line1: { type: String },
    line2: { type: String },
    landmark: { type: String, default: '' },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: String, default: null },
    country: { type: String, default: 'in' },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model('address', schema);

export default Address;
