import dayjs from 'dayjs';
import { ContractStatus } from '../../../../shared/models/rental/contract.js';
import {
  ContractPaymentStatus,
  ContractPaymentType,
} from '../../../../shared/models/rental/contractPayment.js';
import { sendResponse } from '../../../../shared/utils/helper.js';
import Contract from '../../../../shared/models/rental/contract.js';
import ContractPayment from '../../../../shared/models/rental/contractPayment.js';

export const getContracts = async (req, res) => {
  const filter = { tenant: req.user._id };

  if (req.query.status) {
    filter['status'] = req.query.status;
  }

  const data = await Contract.find(filter)
    .populate('property')
    .populate('owner')
    .lean();

  const payload = data.map((item) => ({
    _id: item._id,
    contractId: item.contractId,
    property: {
      _id: item.property._id,
      name: item.property.name,
      images: item.property.mainImages,
      bhk: item.property.bhk,
      door: item.property.door,
      address: item.property.address,
    },
    rentAmount: item.rentAmount,
    paymentDueDate: item.dueDate,
    isPaymentDue: dayjs().isAfter(item.dueDate),
    isTokenAdvancePaid: item.tokenAdvance.isPaid,
    isSecurityDepositPaid: item.securityDeposit.isPaid,
    createdAt: item.createdAt,
  }));

  return sendResponse(res, 200, 'success', payload);
};

export const getContractById = async (req, res) => {
  const userId = req.user._id;
  const data = await Contract.findOne({
    _id: req.params.id,
    tenant: userId,
  })
    .populate('property')
    .populate('owner', 'fname lname mobile')
    .lean();

  if (!data) return sendResponse(res, 404, 'contract does not exist');

  return sendResponse(res, 200, 'success', data);
};

export const getPayments = async (req, res) => {
  const data = await ContractPayment.find({
    contract: req.params.id,
  }).lean();

  return sendResponse(res, 200, 'success', data);
};

export const tokenPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
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

  return sendResponse(res, 200, 'Token Paid Successfully', data);
};

export const depositPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
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

  return sendResponse(res, 200, 'Deposit Paid Successfully', data);
};

export const rentPayment = async (req, res) => {
  const userId = req.user._id;
  const contractId = req.params.id;

  const contract = await Contract.findOne({ _id: contractId, tenant: userId });
  const prevDue = contract.dueDate;

  if (!contract) {
    return sendResponse(res, 404, 'Contract Does not Exist');
  }

  const data = await ContractPayment.create({
    contract: contractId,
    type: ContractPaymentType.RENT,
    amount: contract.rentAmount,
    status: ContractPaymentStatus.PAID,
  });

  contract.dueDate = dayjs(prevDue).add(1, 'month').toDate();

  await contract.save();

  return sendResponse(res, 200, 'Rent Paid Successfully', data);
};
