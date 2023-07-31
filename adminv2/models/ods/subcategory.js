import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    videos: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceSubcategory = mongoose.model('serviceSubcategory', schema);

export default ServiceSubcategory;
