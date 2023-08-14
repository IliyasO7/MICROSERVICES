import { CounterName } from '../../../../shared/models/counter.js';
import Property from '../../../../shared/models/rental/property.js';
import User from '../../../../shared/models/user.js';
import {
  getSequenceId,
  sendResponse,
} from '../../../../shared/utils/helper.js';

export const createProperty = async (req, res) => {
  const propertyId = await getSequenceId('HJP', CounterName.PROPERTY);
  const user = await User.findOne({ _id: req.body.ownerId }).lean();
  if (!user) return sendResponse(res, 400, 'owner does not exist');
  if (!user.owner?.isRegistered)
    return sendResponse(res, 400, 'the provided user is not an owner');

  const data = new Property({
    propertyId,
    owner: user._id,
    ...req.body,
    createdBy: req.user._id,
  });

  await data.save();

  sendResponse(res, 200, 'Property Saved Successfully', data);
};

export const getProperties = async (req, res) => {
  const filter = {};

  if (req.query.mine == 'true') {
    filter['createdBy'] = req.user._id;
  }

  if (req.query.name) {
    filter['name'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.propertyId) {
    filter['propertyId'] = req.query.propertyId;
  }

  if (req.query.ownerId) {
    filter['owner'] = req.query.ownerId;
  }

  const data = await Property.find(filter)
    .populate('owner', 'fname lname email mobile')
    .lean();

  sendResponse(res, 200, 'success', data);
};

export const getPropertyById = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  })
    .populate('owner', 'fname lname email mobile')
    .lean();

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  sendResponse(res, 200, 'success', data);
};

export const updateProperty = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  });

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  Object.assign(data, req.body);

  await data.save();

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
