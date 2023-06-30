import Joi from "joi";

const sendOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
});

const verifYOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
  otp: Joi.string().length(4).required(),
});

const signUp = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string().length(10).required(),
});

export default {
  sendOtp,
  verifYOtp,
  signUp
};
