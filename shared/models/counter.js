import mongoose from 'mongoose';
import { getEnums } from '../utils/helper.js';

export const CounterName = {
  PROPERTY: 'property',
  CONTRACT: 'contract',
  VENDOR: 'vendor',
};

const schema = new mongoose.Schema(
  {
    _id: { type: String, required: true, enum: Object.keys(CounterName) },
    value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Counter = mongoose.model('counter', schema);

export default Counter;
