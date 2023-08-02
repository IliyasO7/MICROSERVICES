import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String },
    image: { type: String },
    videos: [String],
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: "serviceCatalog" },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model("serviceCategory", schema);

export default ServiceCategory;
