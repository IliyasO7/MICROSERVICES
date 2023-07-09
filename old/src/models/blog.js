const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const Blogs = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  subTitle: { type: String },
  body: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  archived: { type: Boolean, default: false },
});

Blogs.plugin(timestamp);

module.exports = mongoose.model("Blogs", Blogs);
