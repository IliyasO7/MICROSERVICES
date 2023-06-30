import Joi from "joi";

const sendOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
});

const verifYOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
  otp: Joi.string().length(4).required(),
});

export default {
  sendOtp,
  verifYOtp,
};
