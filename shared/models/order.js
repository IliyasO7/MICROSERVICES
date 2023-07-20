import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    orderId: { type: String, required: true },
    orderNo: { type: String, default: null, required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    assignedAt: { type: Date, default: null },
    beforeJobImage: { type: String, default: null },
    afterJobImage: { type: String, default: null },
    address: {
        type: mongoose.Schema.Types.ObjectId,ref: "address"
    },
    paused: { type: Boolean, default: false },
    taxes: [
      {
        name: { type: String, default: null },
        amount: { type: Number, default: null },
      },
    ],
    paidAmount:{type:Number},
    paymentId:{  type: mongoose.Schema.Types.ObjectId,ref: "payment"},
    serviceDate: { type: Date, default: null },
    serviceTime: { type: String, default: null },
    filters: { type: String, default: null },
    status: { type: String, default: "Pending" },
    rejectionReason: { type: String, default: null },
    cancellationReason: { type: String, default: null },
    otp: { type: String, default: null },
    isRescheduled: { type: Boolean, default: false, required: true },
    rating :{
        byVendor:{
            overallRating:{ type: Number, default: null },
            service: { type: Number, default: null },
            behaviour: { type: Number, default: null },
            cleaning: { type: Number, default: null },
            feedback: { type: String, default: null },
        },
        byUser:{
            overallRating:{ type: Number, default: null },
            service: { type: Number, default: null },
            behaviour: { type: Number, default: null },
            cleaning: { type: Number, default: null },
            feedback: { type: String, default: null },

        }
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  },
  {
    timestamp: true,
  }
);

const Order = mongoose.model("order", schema);

export default Order;
