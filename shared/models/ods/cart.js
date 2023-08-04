import mongoose from 'mongoose';
import { ObjectId } from '../../../shared/utils/helper.js';

const schema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    services: [
      {
        serviceId: { type: ObjectId, ref: 'service' },
        subServiceId: { type: ObjectId },
        quantity: { type: Number, default: 0 },
        rate: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', schema);

export default Cart;
