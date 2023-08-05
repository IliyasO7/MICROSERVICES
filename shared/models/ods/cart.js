import mongoose from 'mongoose';
import { ObjectId } from '../../../shared/utils/helper.js';

const schema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    service: {
      type: ObjectId,
      ref: 'service',
    },
    items: [
      {
        packageId: { type: ObjectId, ref: 'servicePackage' },
        subPackageId: { type: ObjectId },
        quantity: { type: Number, default: 0 },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', schema);

export default Cart;
