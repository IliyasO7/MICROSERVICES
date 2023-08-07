import Property from '../../../../shared/models/rental/property.js';
import { sendResponse } from '../../../../shared/utils/helper.js';
import axios from 'axios';
import fs from 'fs';

export const createProperty = async (req, res) => {
  const ownerId = req.body.ownerId;
  const name = req.body.name;
  const address = req.body.address;
  const floor = req.body.floor;
  const door = req.body.door;
  const bhk = req.body.bhk;
  const carpetArea = req.body.carpetArea;
  const coordinates = req.body.coordinates;
  const rentAmount = req.body.rentAmount;
  const securityDepositAmount = req.body.depositAmount;

  const property = await Property.countDocuments({});
  const sku = `HJR${property + 1}`;

  const data = await Property.create({
    propertyId: sku,
    proprietor: ownerId,
    name,
    address,
    floor,
    door,
    bhk,
    carpetArea,
    coordinates,
    rentAmount,
    securityDepositAmount,
    createdBy: req.user._id,
  });

  return sendResponse(res, 200, 'Property Saved Successfully', data);
};

export const getProperties = async (req, res) => {
  const filter = {};

  if (req.query.mine == 'true') {
    filter['createdBy'] = req.user._id;
  }

  const data = await Property.find(filter).populate('proprietor');
  return sendResponse(res, 200, 'Properties Fetched Successfully', data);
};

export const getPropertyById = async (req, res) => {
  const data = await Property.findOne({
    _id: req.params.id,
  })
    .populate('proprietor')
    .lean();

  if (!data) return sendResponse(res, 404, 'Property does not exist');

  sendResponse(res, 200, 'Property Data Fetched Successfully', data);
};
