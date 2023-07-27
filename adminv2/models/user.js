import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fname: { type: String, default: null },
    lname: { type: String, default: null },
    email: { type: String, lowercase: true },
    mobile: { type: String, unique: true, default: null, required: true },
    pan: { type: String },
    aadhaar: { type: String },
    panDocument: { type: String },
    aadhaarDocument: { type: String },
    cancelledCheque: { type: String },
    country: { type: String, default: "in" },
    rating: { type: Number, default: 1, required: true },
    isProfileCompleted: { type: Boolean, default: false },
    isKycVerified: { type: Boolean, default: false },
    customer: {
      isActive: { type: Boolean, default: true },
    },
    tenant: {
      isActive: { type: Boolean, default: false },
      addedBy: { type: mongoose.Types.ObjectId, ref: "admin" },
    },
    proprietor: {
      isActive: { type: Boolean, default: false },
      addedBy: { type: mongoose.Types.ObjectId, ref: "admin" },
    },
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model("user", schema);

export default User;
