import { sendResponse } from '../../../../shared/utils/helper.js';
import Vendor from '../../../models/ods/vendor.js';
import RandomString from 'randomstring';
import bcrypt from 'bcrypt';

export const createVendor = async (req, res) => {
  const vendorId = await RandomString.generate({
    length: 8,
    charset: 'alphanumeric',
    capitalization: 'uppercase',
  });

  const data = new Vendor({
    vendorId,
    ...req.body,
    authorizedPerson: {
      ...req.body.authorizedPerson,
      password: await bcrypt.hash(req.body.authorizedPerson.password, 10),
    },
  });

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const getVendors = async (req, res) => {
  const filter = {};
  const offset = parseInt(req.query.offset || 0);
  const limit = parseInt(req.query.limit || 50);

  if (req.query.businessName) {
    filter['businessName'] = new RegExp(req.query.businessName, 'i');
  }

  if (req.query.mobile) {
    filter['authorizedPerson.mobile'] = req.query.mobile;
  }

  if (req.query.gstNo) {
    filter['gstNo'] = new RegExp(req.query.gstNo, 'i');
  }

  if (req.query.pincode) {
    filter['serviceAreas'] = req.query.pincode;
  }

  if (req.query.serviceId) {
    filter['services'] = req.query.serviceId;
  }

  const data = await Vendor.find(filter).lean().skip(offset).limit(limit);

  sendResponse(res, 200, 'success', data);
};

export const getVendorById = async (req, res) => {
  const data = await Vendor.findById(req.params.id).lean().populate('services');
  if (!data) return sendResponse(res, 404, 'vendor not found');

  sendResponse(res, 200, 'success', data);
};

export const updateVendor = async (req, res) => {
  const data = await Vendor.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'vendor not found');

  const { authorizedPerson, payment, bank, ...rest } = req.body;

  Object.assign(data, rest);

  if (authorizedPerson) Object.assign(data.authorizedPerson, authorizedPerson);
  if (payment) Object.assign(data.payment, payment);
  if (bank) Object.assign(data.bank, bank);

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const deleteVendor = async (req, res) => {
  const data = await Vendor.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'vendor not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
