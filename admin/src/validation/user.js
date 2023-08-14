import joi from 'joi';
import validators from '../../../shared/utils/validators.js';

export const createUser = joi.object({
  fname: joi.string().required(),
  lname: joi.string().allow(''),
  email: joi.string().allow(''),
  mobile: joi.string().length(10).required(),
  aadhaar: joi.string().length(12).allow(''),
  aadhaarDocument: joi.string().allow(''),
  pan: joi.string().length(10).allow(''),
  panDocument: joi.string().allow(''),
  bank: joi.object({
    name: joi.string().required(),
    accountNo: joi.string().required(),
    ifscCode: joi.string().required(),
    document: validators.fileKey('users/passbooks').allow(''),
  }),
  isOwner: joi.boolean(),
});

export const updateUser = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  email: joi.string().email(),
  aadhaar: joi.string().length(12).allow(''),
  aadhaarDocument: joi.string().allow(''),
  pan: joi.string().length(10).allow(''),
  panDocument: joi.string().allow(''),
  owner: joi.object({
    isRegistered: joi.boolean().required(),
    isActive: joi.boolean().required(),
  }),
  tenant: joi.object({
    isRegistered: joi.boolean().required(),
    isActive: joi.boolean().required(),
  }),
});

export const createUserAddress = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  mobile: joi.string().length(10),
  line1: joi.string().required(),
  line2: joi.string().allow(''),
  landmark: joi.string().allow(''),
  city: joi.string().lowercase().required(),
  state: joi.string().lowercase().required(),
  pincode: joi.string().length(6).required(),
});
