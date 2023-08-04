import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    mobile: { type: String },
    address: { type: String, default: null },
    landmark: { type: String, default: "" },
    city: { type: String, default: null },
    state: { type: String, default: null },
    pincode: { type: String, default: null },
    country: { type: String, default: "in" },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const Address = mongoose.model("address", schema);

export default Address;
