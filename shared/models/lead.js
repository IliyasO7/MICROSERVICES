import mongoose from 'mongoose';
import { getEnums } from '../utils/helper.js';

export const LeadType = {
  ODS: 'ods',
};

export const LeadPlatform = {
  FACEBOOK: 'facebook',
};

export const LeadStatus = {
  PENDING: 'pending',
  VIEWED: 'viewed',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: getEnums(LeadType) },
    platform: {
      type: String,
      enum: getEnums(LeadPlatform),
    },
    customerInfo: {
      name: { type: String },
      mobile: { type: String },
      email: { type: String },
      city: { type: String },
    },
    inspectionDate: { type: Date },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'service' },
    remarks: [
      {
        text: { type: String },
        createdAt: { type: Date },
      },
    ],
    status: {
      type: String,
      default: LeadStatus.PENDING,
      enum: getEnums(LeadStatus),
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model('lead', schema);

export default Lead;
