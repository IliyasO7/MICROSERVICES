import { sendResponse } from '../../../../shared/utils/helper.js';
import Package from '../../../models/ods/package.js';

export const createPackage = async (req, res) => {
  const data = new Package({
    ...req.body,
  });

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const getPackages = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter['name'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.service) {
    filter['service'] = req.query.service;
  }

  const data = await Package.find(filter).lean();

  sendResponse(res, 200, 'success', data);
};

export const getPackageById = async (req, res) => {
  const data = await Package.findById(req.params.id).lean().populate('service');
  if (!data) return sendResponse(res, 404, 'package not found');

  sendResponse(res, 200, 'success', data);
};

export const updatePackage = async (req, res) => {
  const data = await Package.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'package not found');

  Object.assign(data, req.body);

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const deletePackage = async (req, res) => {
  const data = await Package.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'package not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
