import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null,required:true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service',default:null, required: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamp: true,
  }
);

const VendorServices = mongoose.model("VendorServices", schema);

export default VendorServices;