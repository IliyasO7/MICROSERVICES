import dayjs from 'dayjs';
import { sendResponse } from '../../../../shared/utils/helper.js';
import Contract from '../../../../shared/models/rental/contract.js';
import ContractPayment from '../../../../shared/models/rental/contractPayment.js';

export const getContracts = async (req, res) => {
  const filter = { owner: req.user._id };

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
    .populate('tenant')
    .lean();

  return sendResponse(res, 200, 'Contracts Fetched Successfully', data);
};

export const getPayments = async (req, res) => {
  const data = await ContractPayment.find({
    contract: req.params.id,
  }).lean();

  return sendResponse(res, 200, 'Contracts Payments Successfully', data);
};
