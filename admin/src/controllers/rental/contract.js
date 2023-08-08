import { sendResponse } from '../../../../shared/utils/helper.js';
import Contract from '../../../../shared/models/rental/contract.js';

export const getContracts = async (req, res) => {
  const userId = req.user._id;

  const contracts = await Contract.find({ createdBy: userId })
    .populate('property')
    .populate('proprietor')
    .populate('tenant');
  return sendResponse(res, 200, 'Bookings Fetched Successfully', contracts);
};

export const getContractById = async (req, res) => {
  const filter = { _id: req.params.contractId };

  const contract = await Contract.findOne(filter)
    .populate('property')
    .populate('proprietor')
    .populate('tenant');

  sendResponse(res, 200, 'Contracts Fetched Successfully', {
    contract,
  });
};
