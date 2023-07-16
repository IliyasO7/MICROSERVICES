const mongoose = require("mongoose");
import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }, 
  },
  {
    timestamp: true,
  }
);

const category = mongoose.model("category", schema);

export default category;
/*
const categorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true },
});

categorySchema.plugin(timestamp);

module.exports = mongoose.model("Category", categorySchema);*/
