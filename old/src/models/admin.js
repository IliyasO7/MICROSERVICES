const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const adminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  status: { type: String, default: "Active" },
});

adminSchema.plugin(timestamp);

module.exports = mongoose.model("Admin", adminSchema);
