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
  address: joi.string().required(),
  city: joi.string().lowercase().required(),
  state: joi.string().lowercase().required(),
  pincode: joi.string().length(6).required(),
  country: joi.string().min(2).lowercase().required(),
});

export const updateAddress = joi.object({
  address: joi.string(),
  city: joi.string().lowercase(),
  state: joi.string().lowercase(),
  pincode: joi.string().length(6),
  country: joi.string().min(2).lowercase(),
});

export const createBankAccount = joi.object({
  name: joi.string().required(),
  accountNumber: joi.string().required(),
  ifscCode: joi.string().required(),
});

export const updateBankAccount = joi.object({
  name: joi.string(),
  accountNumber: joi.string(),
  ifscCode: joi.string(),
});
