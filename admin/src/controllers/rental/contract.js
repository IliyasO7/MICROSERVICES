import dayjs from 'dayjs';
import {
  getSequenceId,
  sendResponse,
} from '../../../../shared/utils/helper.js';
import Contract from '../../../../shared/models/rental/contract.js';
import Property from '../../../../shared/models/rental/property.js';
import { CounterName } from '../../../../shared/models/counter.js';
import User from '../../../../shared/models/user.js';

export const createContract = async (req, res) => {
  const property = await Property.findById(req.body.propertyId);
  if (!property) return sendResponse(res, 400, 'property does not exist');

  const contractId = await getSequenceId('HJC', CounterName.CONTRACT);

  const data = new Contract({
    contractId,
    property: property._id,
    tenant: req.body.tenantId,
    owner: property.owner,
    rentAmount: property.rentAmount,
    moveInDate: req.body.moveInDate,
    moveOutDate: req.body.moveOutDate ?? '',
    dueDate: dayjs(req.body.moveInDate).add(1, 'month').toDate(),
    'tokenAdvance.amount': property.tokenAmount,
    'securityDeposit.amount': property.securityDepositAmount,
    commissionPercentage: req.body.commissionPercentage,
    createdBy: req.user._id,
  });

  await User.updateOne(
    { _id: req.body.tenantId },
    { tenant: { isRegistered: true, isActive: true } }
  );
  await data.save();

  sendResponse(res, 200, data);
};

export const getContracts = async (req, res) => {
  const filter = {};

  if (req.query.contractId) {
    filter['contractId'] = new RegExp(req.query.contractId, 'i');
  }

  if (req.query.ownerId) {
    filter['owner'] = req.query.ownerId;
  }

  if (req.query.tenantId) {
    filter['tenant'] = req.query.tenantId;
  }

  const contracts = await Contract.find(filter)
    .populate('property')
    .populate('owner', 'fname lname email mobile')
    .populate('tenant', 'fname lname email mobile')
    .lean();

  sendResponse(res, 200, 'success', contracts);
};

export const getContractById = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id })
    .populate('property')
    .populate('owner', 'fname lname email mobile')
    .populate('tenant', 'fname lname email mobile')
    .lean();

  if (!contract) return sendResponse(res, 400, 'contract does not exist');

  sendResponse(res, 200, 'success', contract);
};

export const updateContract = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id });
  if (!contract) return sendResponse(res, 400, 'contract does not exist');

  Object.assign(contract, req.body);

  await contract.save();

  sendResponse(res, 200, 'success', contract);
};

export const deleteContract = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id });
  if (!contract) return sendResponse(res, 400, 'contract does not exist');

  await contract.deleteOne();

  sendResponse(res, 200, 'success');
};
