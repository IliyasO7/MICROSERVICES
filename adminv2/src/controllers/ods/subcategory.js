import ServiceSubcategory from '../../../models/ods/subcategory.js';
import { sendResponse } from '../../../../shared/utils/helper.js';

export const createSubCategory = async (req, res) => {
  const data = new ServiceSubcategory({
    ...req.body,
  });

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const getSubCategory = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter['name'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.category) {
    (filter['category'] = req), query.category;
  }

  if (req.query.isEnabled) {
    filter['isEnabled'] = req.query.isEnabled;
  }

  const data = await ServiceSubcategory.find(filter).lean();

  sendResponse(res, 200, 'success', data);
};

export const getSubCategoryById = async (req, res) => {
  const data = await ServiceSubcategory.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, 'category not found');

  sendResponse(res, 200, 'success', data);
};

export const updateSubCategory = async (req, res) => {
  const data = await ServiceSubcategory.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'category not found');

  Object.assign(data, req.body);

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const deleteSubCategory = async (req, res) => {
  const data = await ServiceSubcategory.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'category not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
