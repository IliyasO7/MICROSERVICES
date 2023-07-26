import { ContractStatus } from "../../../models/contract.js";
import {
  ContractPaymentStatus,
  ContractPaymentType,
} from "../../../models/contractPayment.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
import Contract from "../../../models/contract.js";
import ContractPayment from "../../../models/contractPayment.js";

/*
'/contracts/:id/token-payment'
'/contracts/:id/security-deposit'
'/contracts/:id/rent'
*/

//Get All Bookings created by admin
export const getContracts = async (req, res) => {
  const filter = { tenant: req.user._id };
  if (req.query.status) {
    filter["status"] = req.query.status;
  }
  const data = await Contract.find(filter)
    .populate("property")
    .populate("proprietor")
    .populate("tenant")
    .lean();
  return sendResponse(res, 200, "Contracts  Fetched Successfully", data);
};

//GET Booking Details wrt id
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
  return sendResponse(res, 200, "Bookings Fetched Successfully", data);
};

export const tokenPayment = async (req, res) => {
  const userId = req.user;
  const contractId = req.params.contractId;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, "Contract Does not Exist");
  }

  const data = await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.TOKEN,
    amount: contract.tokenAdvance.amount,
    status: ContractPaymentStatus.PAID,
  });

  contract.tokenAdvance.isPaid = true;
  contract.tokenAdvance.paidAt = new Date();
  contract.status = ContractStatus.ACTIVE;

  await contract.save();

  return sendResponse(res, 200, "Token Paid Successfully", data);
};

export const depositPayment = async (req, res) => {
  const userId = req.user;
  const contractId = req.params.contractId;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, "Contract Does not Exist");
  }

  const data = await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.DEPOSIT,
    amount: contract.securityDeposit.amount,
    status: ContractPaymentStatus.PAID,
  });

  contract.securityDeposit.isPaid = true;
  contract.securityDeposit.paidAt = new Date();
  contract.status = ContractStatus.ACTIVE;
  //token and deposit one time payment status has to change to active
  await contract.save();

  return sendResponse(res, 200, "Deposit Paid Successfully", data);
};

export const rentPayment = async (req, res) => {
  const userId = req.user;
  const contractId = req.params.contractId;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });
  const prevDue = contract.dueDate;

  if (!contract) {
    return sendResponse(res, 404, "Contract Does not Exist");
  }

  const data = await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.RENT,
    amount: contract.rentAmount,
    status: ContractPaymentStatus.PAID,
  });
  const nextDue = dayjs(prevDue).add(1, "month").toDate();
  contract.dueDate = nextDue;
  contract.save();

  return sendResponse(res, 200, "Rent Paid Successfully", data);
};
