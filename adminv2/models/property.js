import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
    },
    proprietor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    name: { type: String, default: null, required: true },
    address: { type: String, default: null, required: true },
    floor: { type: String, default: null, required: true },
    door: { type: String, default: null },
    bhk: { type: String, default: null, required: true },
    carpetArea: { type: String, default: null, },
    coordinates: { type: [Number],  },
    mainImages: [{ type: String, default: null }],
    entranceImages: [{ type: String, default: null }],
    livingImages: [{ type: String, default: null }],
    kitchenImages: [{ type: String, default: null }],
    bedroomImages: [{ type: String, default: null }],
    tokenAmount: { type: Number, default: null },
    depositAmount: { type: Number },
    rentAmount: { type: Number, default: null, required: true },
    isOccupied: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

schema.index({ proprietor: 1 });

const Property = mongoose.model('Property', schema);

export default Property;
