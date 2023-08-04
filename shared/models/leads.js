import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    customerName: { type: String },
    phone: { type: Number },
    email: { type: String },
    city: { type: String, default: "No City Choosen" },
    type: { type: String, default: "ods", required: true },
    inspectionDate: { type: Date },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "service" },
    remarks: [
      {
        text: { type: String },
        remarkTime: { type: String },
      },
    ],
    status: { type: String, default: "unread" },

    platform: { type: String },
  },
  { timestamps: true }
);

const Leads = mongoose.model("leads", schema);

export default Leads;
