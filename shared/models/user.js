import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    fname: { type: String, default: null },
    lname: { type: String, default: null },
    email: { type: String, lowercase: true },
    mobile: { type: String, default: null, required: true },
    country: { type: String, default: 'in' },
    status: { type: String, default: 'Active' },
    rating: { type: Number, default: 1, required: true },
    isProfileCompleted: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model('user', schema);

export default User;
