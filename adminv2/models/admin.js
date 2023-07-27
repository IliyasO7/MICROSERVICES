import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    adminId: { type: String, required: true }, //HJRA HJOA
    username: { type: String, required: true },
    role: { type: String, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    status: { type: String, default: "ACTIVE", enum: ["ACTIVE", "INACTIVE"] },
    createdBy: { type: String, default: null },
  },
  {
    timestamp: true,
  }
);

const Admin = mongoose.model("admin", schema);

export default Admin;
