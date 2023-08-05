import mongoose from 'mongoose';
import { ObjectId, getEnums } from '../../../shared/utils/helper.js';

export const OrderStatus = {
  PENDING: 'pending',
  PLACED: 'placed',
  ASSIGNED: 'assigned',
  STARTED: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const schema = new mongoose.Schema(
  {
    orderId: { type: String },
    user: { type: ObjectId, ref: 'user' },
    vendor: { type: ObjectId, ref: 'vendor' },
    service: { type: ObjectId, ref: 'service' },
    cart: { type: ObjectId, ref: 'cart' },
    invoice: { type: ObjectId, ref: 'invoice' },
    address: { type: Object },
    scheduledDate: { type: Date },
    items: [
      {
        packageId: { type: ObjectId, ref: 'servicePackage' },
        packageName: { type: String },
        subPackageId: { type: ObjectId },
        subPackageName: { type: String },
        quantity: { type: Number },
        rate: { type: Number },
        amount: { type: Number },
        taxAmount: { type: Number },
        totalAmount: { type: Number },
      },
    ],
    paymentSummary: {
      itemAmount: { type: Number },
      taxAmount: { type: Number },
      tipAmount: { type: Number },
      totalAmount: { type: Number },
      history: [{ type: ObjectId, ref: 'payment' }],
    },
    placedAt: { type: Date },
    assignedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    status: {
      type: String,
      default: OrderStatus.PENDING,
      enum: getEnums(OrderStatus),
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('order', schema);

export default Order;
