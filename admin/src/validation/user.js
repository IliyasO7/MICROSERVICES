import joi from 'joi';

export const createUser = joi.object({
  fname: joi.string().required(),
  lname: joi.string().allow(''),
  email: joi.string().allow(''),
  mobile: joi.string().length(10).required(),
  aadhaar: joi.string().length(12).allow(''),
  pan: joi.string().length(10).allow(''),
  isOwner: joi.boolean(),
});

export const updateUser = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  email: joi.string().email(),
  aadhaar: joi.string().length(12).allow(''),
  pan: joi.string().length(10).allow(''),
  owner: joi.object({
    isRegistered: joi.boolean().required(),
    isActive: joi.boolean().required(),
  }),
  tenant: joi.object({
    isRegistered: joi.boolean().required(),
    isActive: joi.boolean().required(),
  }),
});
