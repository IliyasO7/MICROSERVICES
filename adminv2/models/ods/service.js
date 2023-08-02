import mongoose from 'mongoose';
import { getEnums } from '../../../shared/utils/helper.js';
import { ServiceCategory } from '../../../shared/utils/constants.js';

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    videos: [String],
    category: { type: String, enum: getEnums(ServiceCategory) },
    hsn: { type: String },
    taxPercentage: { type: Number },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model('service', schema);

export default Service;
