import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    videos: [String],
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceSubcategory = mongoose.model('serviceSubcategory', schema);

export default ServiceSubcategory;
