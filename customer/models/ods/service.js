import mongoose from "mongoose";
import { ObjectId } from "../../../shared/utils/helper.js";

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
    catalog: { type: ObjectId, ref: "serviceCatalog" },
    category: { type: ObjectId, ref: "serviceCategory" },
    price: { type: Number },
    time: { type: Number },
    maxQuantity: { type: Number, default: null },
  },
  { timestamps: true }
);

schema.add({
  subServices: [schema],
});

const Service = mongoose.model("service", schema);

export default Service;
