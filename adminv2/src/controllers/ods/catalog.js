import Catalog from '../../../models/ods/catalog.js';
import { sendResponse } from '../../../../shared/utils/helper.js';

export const createCatalog = async (req, res) => {
  const data = new Catalog({
    ...req.body,
  });

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const getCatalog = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter['name'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.isEnabled) {
    filter['isEnabled'] = req.query.isEnabled;
  }

  const data = await Catalog.find(filter).lean();

  sendResponse(res, 200, 'success', data);
};

export const getCatalogById = async (req, res) => {
  const data = await Catalog.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, 'catalog not found');

  sendResponse(res, 200, 'success', data);
};

export const updateCatalog = async (req, res) => {
  const data = await Catalog.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'catalog not found');

  Object.assign(data, req.body);

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const deleteCatalog = async (req, res) => {
  const data = await Catalog.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'catalog not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
