import mongoose from 'mongoose';
import { ObjectId } from '../../utils/helper.js';

const schema = new mongoose.Schema(
  {
    propertyId: { type: String, unique: true },
    owner: { type: ObjectId, ref: 'user' },
    name: { type: String },

    address: {
      floor: String,
      door: String,
      line1: String,
      line2: String,
    },

    mainImages: [String],
    entranceImages: [String],
    livingImages: [String],
    kitchenImages: [String],
    bedroomImages: [String],

    tokenAmount: { type: Number, default: 0 },
    rentAmount: { type: Number, default: 0 },
    securityDepositAmount: { type: Number, default: 0 },

    address: { type: String, default: null },
    floor: { type: String, default: null },
    door: { type: String, default: null },
    bhk: { type: String, default: null },
    carpetArea: { type: String, default: null },
    coordinates: { type: [Number] },

    isOccupied: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
    createdBy: {
      type: ObjectId,
      ref: 'admin',
    },
  },
  {
    timestamp: true,
  }
);

schema.index({ propertyId: 1 });
schema.index({ owner: 1 });

const Property = mongoose.model('property', schema);

export default Property;
