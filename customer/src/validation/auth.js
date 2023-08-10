import joi from 'joi';

export const sendOtp = joi.object({
  mobile: joi.string().length(10).required(),
});

export const verifYOtp = joi.object({
  mobile: joi.string().length(10).required(),
  otp: joi.string().length(4).required(),
});

export const register = joi.object({
  fname: joi.string().required(),
  lname: joi.string().required(),
  email: joi.string().email().lowercase().required(),
  mobile: joi.string().length(10).required(),
});
