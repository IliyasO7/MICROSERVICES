import joi from 'joi';

export const createProfile = joi.object({
  fname: joi.string().required(),
  lname: joi.string().required(),
  email: joi.string().lowercase().email().required(),
});

export const updateProfile = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  email: joi.string().lowercase().email(),
});

export const createAddress = joi.object({
  fname: joi.string().required(),
  lname: joi.string().required(),
  mobile: joi.string().length(10),
  line1: joi.string().required(),
  line2: joi.string().allow(''),
  landmark: joi.string().allow(''),
  city: joi.string().lowercase().required(),
  state: joi.string().lowercase().required(),
  pincode: joi.string().length(6).required(),
});

export const updateAddress = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  mobile: joi.string().length(10),
  line1: joi.string(),
  line2: joi.string().allow(''),
  landmark: joi.string().allow(''),
  city: joi.string().lowercase(),
  state: joi.string().lowercase(),
  pincode: joi.string().length(6),
});

export const createBankAccount = joi.object({
  name: joi.string().required(),
  accountNumber: joi.number().min(10).required(),
  ifscCode: joi.string().required(),
});

export const updateBankAccount = joi.object({
  name: joi.string(),
  accountNumber: joi.number().min(10),
  ifscCode: joi.string(),
});
