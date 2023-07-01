import Joi from "joi";

const sendOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
});

const verifYOtp = Joi.object({
  mobile: Joi.string().length(10).required(),
  otp: Joi.string().length(4).required(),
});

const updateProfile = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
});

const address = Joi.object({
  default: Joi.boolean().required(),
  address: Joi.string().required(),
  city: Joi.string().uppercase().required(),
  state:Joi.string().uppercase().required(),
  pincode:Joi.string().length(6).required(),
  country:Joi.string().min(2).lowercase().required(),
});


export default {
  sendOtp,
  verifYOtp,
  updateProfile,
  address
};
