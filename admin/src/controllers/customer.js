import User from '../../../shared/models/rental/property.js';
import { sendResponse } from '../../../shared/utils/helper.js';

export const getCustomers = async (req, res) => {
  const filter = {};

  if (req.query.mobile) {
    filter['mobile'] = req.query.mobile;
  }

  const data = await User.find(filter).lean();

  return sendResponse(res, 200, 'success', data);
};

export const getCustomerById = async (req, res) => {
  const data = await User.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, 'customer does not exist');

  sendResponse(res, 200, 'success', data);
};

export const updateCustomer = async (req, res) => {
  const data = await User.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'customer does not exist');

  Object.assign(data, req.body);

  await data.save();
  sendResponse(res, 200, 'success', data);
};

export const deleteCustomer = async (req, res) => {
  const data = await User.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'customer does not exist');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
