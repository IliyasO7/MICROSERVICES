//HOMESJOY TECHNOLOGIES PRIVATE LIMITED

import mongoose from "mongoose";
import { ObjectId, getEnums } from "../../../shared/utils/helper.js";

export const CompanyName = {
  ODS: "HOMESJOY TECHNOLOGIES PRIVATE LIMITED",
  RENTAL: "HOUSEJOY RENTAL PRIVATE LIMITED",
  REALITY: "HOUSEJOY REALTY PRIVATE LIMITED",
};

export const States = {
  MH: "MAHARASHTRA",
  KA: "KARNATAKA",
  TN: "TAMIL NADU",
  AP: "ANDHRA PRADESH",
};

export const Gst = {
  GSTNO: "29AAFCH1019J1ZP",
};

const schema = new mongoose.Schema(
  {
    companyName: { type: String, default: CompanyName.ODS },
    gst: { type: String, default: Gst.GSTNO },
    cgst: { type: Number, default: 2.5 },
    sgst: { type: Number, default: 2.5 },
    igst: { type: Number, default: 0 },
    item: { type: ObjectId, ref: "service" },
    qty: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    invoiceDate: { type: Date },
    billedTo: { type: ObjectId, ref: "user" },
    state: { type: String, default: States.KA },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", schema);

export default Invoice;
