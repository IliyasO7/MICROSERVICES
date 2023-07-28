import joi from 'joi';

export const createProperty = joi.object({
  ownerId: joi.string().required(),
  name: joi.string().required(),
  address: joi.string().required(),
  floor: joi.string().required(),
  door: joi.string(),
  bhk: joi.string().required(),
  carpetArea: joi.string().required(),
  coordinates: joi.array().items(joi.number()),
  rentAmount: joi.number().required(),
  depositAmount: joi.number().required(),
});
