import mongoose from "mongoose";
import { getEnums } from "../../../shared/utils/helper.js";

export const ContractPaymentType = {
  TOKEN: "token",
  DEPOSIT: "deposit",
  RENT: "rent",
};

export const ContractPaymentStatus = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: getEnums(ContractPaymentType),
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contract",
    },
    amount: {
      type: Number,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: getEnums(ContractPaymentStatus),
      default: ContractPaymentStatus.PENDING,
    },
  },
  { timestamps: true }
);

const ContractPayment = mongoose.model("contractPayment", schema);

export default ContractPayment;
