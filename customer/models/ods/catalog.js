import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceCatalog = mongoose.model('serviceCatalog', schema);

export default ServiceCatalog;
