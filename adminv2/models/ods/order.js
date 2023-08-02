import mongoose from "mongoose";
import { ObjectId } from "../../../shared/utils/helper.js";

const schema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    services: [
      {
        serviceId: { type: ObjectId, ref: "service" },
        subServiceId: { type: ObjectId },
        quantity: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
      },
    ],
    status: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", schema);

export default Order;
