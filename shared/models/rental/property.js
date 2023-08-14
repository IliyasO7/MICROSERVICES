import mongoose from 'mongoose';
import { ObjectId } from '../../utils/helper.js';

const schema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },
    name: String,
    bhk: Number,
    floor: Number,
    door: Number,
    carpetArea: String,
    address: String,
    mainImages: [String],
    entranceImages: [String],
    livingImages: [String],
    kitchenImages: [String],
    bedroomImages: [String],
    tokenAmount: { type: Number, default: 0 },
    rentAmount: { type: Number, default: 0 },
    securityDepositAmount: { type: Number, default: 0 },
    isOccupied: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    location: {
      type: { type: String },
      coordinates: [Number],
    },
    owner: { type: ObjectId, ref: 'user' },
    createdBy: {
      type: ObjectId,
      ref: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ propertyId: 1 });
schema.index({ owner: 1 });
schema.index({ location: '2dsphere' });

const Property = mongoose.model('property', schema);

export default Property;
