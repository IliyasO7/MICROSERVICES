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

const setDefault = Joi.object({
  default: Joi.boolean().required(),
});

const userRoles = Joi.object({
  isTenant: Joi.boolean(),
  isOwner: Joi.boolean(),
  mobile: Joi.string().length(10).required(),

});

const bankInfo = Joi.object({
  name: Joi.string().required(),
  accountNumber: Joi.number().required(),
  ifscCode: Joi.string().required(),
  default: Joi.boolean()
});

const uid = Joi.object({
  aadharCardNumber:  Joi.number().min(12).required(),
  panCardNumber: Joi.string().length(10).required(),
});
export default {
  sendOtp,
  verifYOtp,
  updateProfile,
  address,
  setDefault,
  userRoles,
  bankInfo,
  uid

};
