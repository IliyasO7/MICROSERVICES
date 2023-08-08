import { CounterName } from '../../../../shared/models/counter.js';
import Property from '../../../../shared/models/rental/property.js';
import {
  getSequenceId,
  sendResponse,
} from '../../../../shared/utils/helper.js';

export const createProperty = async (req, res) => {
  const propertyId = await getSequenceId('HJP', CounterName.PROPERTY);

  const data = new Property({
    propertyId,
    owner: ownerId,
    ...req.body,
    createdBy: req.user._id,
  });

  sendResponse(res, 200, 'Property Saved Successfully', data);
};

export const getProperties = async (req, res) => {
  const filter = {};

  if (req.query.mine == 'true') {
    filter['createdBy'] = req.user._id;
  }

  const data = await Property.find(filter).populate('owner');
  sendResponse(res, 200, 'Properties Fetched Successfully', data);
};

export const getPropertyById = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  })
    .populate('owner')
    .lean();

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  sendResponse(res, 200, 'Property Data Fetched Successfully', data);
};

export const updateProperty = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  }).lean();

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  Object.assign(data, req.body);

  sendResponse(res, 200, 'Property Data Fetched Successfully', data);
};

export const deleteProperty = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  });

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};
