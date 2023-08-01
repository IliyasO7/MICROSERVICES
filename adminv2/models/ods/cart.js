import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    services: [
      {
        serviceId: { type: ObjectId, ref: "service", required: true },
        quantity: { type: Number, default: 0 },
        name: { type: String },
        price: { type: Number },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", schema);

export default Cart;
