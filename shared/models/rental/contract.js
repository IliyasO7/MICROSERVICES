import mongoose from 'mongoose';
import { getEnums } from '../../../shared/utils/helper.js';

export const ContractStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  TERMINATED: 'terminated',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
};

const schema = new mongoose.Schema(
  {
    contractId: {
      type: String,
      unique: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'property',
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    moveInDate: { type: Date },
    moveOutDate: { type: Date },
    dueDate: { type: Date },
    rentAmount: { type: Number, default: 0 },
    tokenAdvance: {
      amount: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
    },
    securityDeposit: {
      amount: { type: Number, default: 0 },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
    },
    commissionPercentage: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: getEnums(ContractStatus),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ contractId: 1 });
schema.index({ tenant: 1 });
schema.index({ proprietor: 1 });

const Contract = mongoose.model('contract', schema);

export default Contract;
