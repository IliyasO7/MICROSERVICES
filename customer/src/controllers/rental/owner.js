import { sendResponse } from '../../../../shared/utils/helper.js';
import Contract from '../../../models/contract.js';
import ContractPayment from '../../../models/contractPayment.js';

export const getContracts = async (req, res) => {
  const filter = { proprietor: req.user._id };

  if (req.query.status) {
    filter['status'] = req.query.status;
  }
  const data = await Contract.find(filter)
    .populate('property')
    .populate('tenant')
    .lean();

  return sendResponse(res, 200, 'Contracts Fetched Successfully', data);
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
