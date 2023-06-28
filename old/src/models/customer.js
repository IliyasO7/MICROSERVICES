const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const customerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fname: { type: String, default: null, required: true },
  lname: { type: String, default: null, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  phone: { type: String, default: null, required: true },
  otp: {
    code: { type: String, default: null },
    createdAt: { type: Date, default: null },
  },
  addresses: [
    {
      default: { type: Boolean, default: false },
      fname: { type: String, default: null, required: true },
      lname: { type: String, default: null, required: true },
      phone: { type: String, default: null, required: true },
      address: { type: String, default: null, required: true },
      city: { type: String, default: null, required: true },
      state: { type: String, default: null, required: true },
      pincode: { type: String, default: null, required: true },
      country: { type: String, default: null, required: true },
    },
  ],
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  country: { type: String, default: "in" },
  note: { type: String, default: null },
  status: { type: String, default: "Active" },
  couponCODEB_COUNT: {
    type: Number,
    default: 0,
  },
  all_Ratings: [{ type: Number }],
  rating: { type: Number, default: 1, required: true },
});

customerSchema.plugin(timestamp);

module.exports = mongoose.model("Customer", customerSchema);
