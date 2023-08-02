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
  mobile: joi.string(),
  address: joi.string().required(),
  landmark: joi.string().allow(''),
  city: joi.string().lowercase().required(),
  state: joi.string().lowercase().required(),
  pincode: joi.string().length(6).required(),
});

export const updateAddress = joi.object({
  mobile: joi.string(),
  address: joi.string(),
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
