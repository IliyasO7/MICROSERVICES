import mongoose from 'mongoose';
import { ObjectId } from '../../../shared/utils/helper.js';

const List = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    image: { type: String },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    name: { type: String },
    description: {
      short: String,
      included: [List],
      excluded: [List],
    },
    images: [String],
    videos: [String],
    service: { type: ObjectId, ref: 'service' },
    price: { type: Number },
    time: { type: Number },
    maxQuantity: { type: Number, default: null },
  },
  { timestamps: true }
);

schema.add({
  subPackages: [schema],
});

const ServicePackage = mongoose.model('servicePackage', schema);

export default ServicePackage;
