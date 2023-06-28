import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    fname: { type: String, default: null },
    lname: { type: String, default: null },
    email: { type: String, unique: true, lowercase: true },
    mobile: { type: String, default: null, required: true },
    country: { type: String, default: "in" },
    status: { type: String, default: "Active" },
    rating: { type: Number, default: 0, required: true },
    isProfileCompleted: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model("user", schema);

export default User;
