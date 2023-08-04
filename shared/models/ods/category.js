import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model('serviceCategory', schema);

export default ServiceCategory;
