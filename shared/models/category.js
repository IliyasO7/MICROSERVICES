import mongoose from "mongoose";
const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }, 
    isActive: {  type: Boolean, default:true, required: true }
  },
  {
    timestamp: true,
  }
);

const Category = mongoose.model("categories", schema);

export default Category;

