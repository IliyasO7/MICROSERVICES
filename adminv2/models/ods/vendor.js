import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    vendorId: { type: String },
    businessName: { type: String },
    businessType: { type: String, enum: ["b2b", "b2c"] },
    address: { type: String },
    gstNo: { type: String },
    gstDocument: { type: String },
    agreementDocument: { type: String },
    authorizedPerson: {
      name: { type: String },
      mobile: { type: String },
      address: { type: String },
      password: { type: String },
      aadhaarNo: { type: String },
      aadhaarDocument: { type: String },
    },
    bank: {
      accountNo: { type: String },
      ifscCode: { type: String },
      document: { type: String },
    },
    payment: {
      amount: { type: Number },
      receiptNo: { type: String },
      document: { type: String },
    },
    serviceAreas: [String],
  },
  { timestamps: true }
);

const Vendor = mongoose.model("vendor", schema);

export default Vendor;
