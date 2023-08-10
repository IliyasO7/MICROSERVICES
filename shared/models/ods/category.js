import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    icon: { type: String },
    serviceCount: { type: String, default: 0 },
    orderCount: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model('serviceCategory', schema);

export default ServiceCategory;
