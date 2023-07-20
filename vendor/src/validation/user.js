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

const verifyKyc = Joi.object({
  aadharCardNumber:  Joi.number().min(12).required(),
  panCardNumber: Joi.string().length(10).required(),
});

const saveOwner = Joi.object({
  fname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string().length(10).required(),
  aadharCardNumber:  Joi.number().min(12).required(),
  panCardNumber: Joi.string().length(10).required(),
  name: Joi.string().required(),
  accountNumber: Joi.number().required(),
  ifscCode: Joi.string().required(),
  isOwner: Joi.boolean().required(),
  
});

const saveInventory = Joi.object({
  propertyName: Joi.string().required(),
  address: Joi.string().required(),
  floor: Joi.string().required(),
  door: Joi.string(),
  bhk: Joi.string().required(),
  carpetArea: Joi.string().required(),
  geolocation: Joi.string(),
  rent: Joi.number().required(),
  securityDeposit: Joi.number().required(),

});

const saveTenant = Joi.object({
  fname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string().length(10).required(),
  inventoryId :  Joi.string().required(),
  isTenant: Joi.boolean().required(),
  tokenAdvance:Joi.number().required(),
 // moveIdDate:Joi.date().required(),
});


const vendorlogin = Joi.object({
  phone: Joi.boolean().required(),
  password: joi.string().required(),
  fcmToken: joi.string().required(),
});

const updateVendor = Joi.object({
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  additionalMobileNumber: Joi.string().required(),
});



export default {
  sendOtp,
  verifYOtp,
  updateProfile,
  updateVendor,
  address,
  setDefault,
  userRoles,
  bankInfo,
  uid,
  saveOwner,
  saveInventory,
  saveTenant,
  verifyKyc,
  vendorlogin,
  updateVendor
};
