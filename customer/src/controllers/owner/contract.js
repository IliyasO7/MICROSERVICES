import { ContractStatus } from "../../../models/contract.js";
import {
  ContractPaymentStatus,
  ContractPaymentType,
} from "../../../models/contractPayment.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
import Contract from "../../../models/contract.js";
import ContractPayment from "../../../models/contractPayment.js";

//Get All Contracts created by admin
export const getContracts = async (req, res) => {
  const filter = { proprietor: req.user._id };
  if (req.query.status) {
    filter["status"] = req.query.status;
  }
  const data = await Contract.find(filter)
    .populate("property")
    .populate("proprietor")
    .populate("tenant")
    .lean();
  return sendResponse(res, 200, "Contracts Fetched Successfully", data);
};

//Get Contract Details wrt Id
export const getContractById = async (req, res) => {
  const userId = req.user._id;
  const data = await Contract.findOne({
    _id: req.params.contractId,
    tenant: userId,
  })
    .populate("property")
    .populate("proprietor")
    .populate("tenant")
    .lean();
  return sendResponse(res, 200, "Contracts Fetched Successfully", data);
};

export const getPayments = async (req, res) => {
  const userId = req.user;
  const data = await ContractPayment.find({
    contract: req.params.contractId,
  }).lean();
  return sendResponse(res, 200, "Contracts Payments Successfully", data);
};
