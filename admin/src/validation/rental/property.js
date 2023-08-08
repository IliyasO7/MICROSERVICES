import joi from 'joi';
import validators from '../../../../shared/utils/validators.js';

export const createProperty = joi.object({
  ownerId: validators.objectId().required(),
  name: joi.string().required(),
  bhk: joi.number().required(),
  floor: joi.number().required(),
  door: joi.number().required(),
  carpetArea: joi.string().allow(''),
  address: joi.string().required(),
  coordinates: joi.array().items(joi.number()),
  tokenAmount: joi.number().required(),
  rentAmount: joi.number().required(),
  securityDepositAmount: joi.number().required(),
  mainImages: joi.array().items(validators.fileKey('properties/images')),
  entranceImages: joi.array().items(validators.fileKey('properties/entrance')),
  livingImages: joi.array().items(validators.fileKey('properties/images')),
  kitchenImages: joi.array().items(validators.fileKey('properties/images')),
  bedroomImages: joi.array().items(validators.fileKey('properties/images')),
});

export const updateProperty = joi.object({
  ownerId: validators.objectId().required(),
  name: joi.string(),
  bhk: joi.number(),
  floor: joi.number(),
  door: joi.number(),
  carpetArea: joi.string().allow(''),
  address: joi.string(),
  coordinates: joi.array().items(joi.number()),
  tokenAmount: joi.number(),
  rentAmount: joi.number(),
  securityDepositAmount: joi.number(),
  mainImages: joi.array().items(validators.fileKey('properties/images')),
  entranceImages: joi.array().items(validators.fileKey('properties/entrance')),
  livingImages: joi.array().items(validators.fileKey('properties/images')),
  kitchenImages: joi.array().items(validators.fileKey('properties/images')),
  bedroomImages: joi.array().items(validators.fileKey('properties/images')),
});
