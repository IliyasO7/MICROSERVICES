import Property from '../../../../shared/models/rental/property.js';
import { sendResponse } from '../../../../shared/utils/helper.js';

export const getProperties = async (req, res) => {
  const filter = {};

  if (req.query.ownerId) {
    filter['owner'] = req.query.ownerId;
  }

  if (req.query.isOccupied) {
    filter['isOccupied'] = req.query.isOccupied == 'true' ? true : false;
  }

  const data = await Property.find(filter).lean();

  sendResponse(res, 200, 'success', data);
};

export const getPropertyById = async (req, res) => {
  const data = await Property.findById(req.params.id)
    .lean()
    .populate('owner', 'fname lname mobile');
  if (!data) return sendResponse(res, 404, 'property does not exist');

  sendResponse(res, 200, 'success', data);
};
