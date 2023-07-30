import Joi from "joi";

const adminCreate = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  role: Joi.string().required(),
});

const saveUserTenant = Joi.object({
  fname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string().length(10).required(),
  propertyId: Joi.string().required(),
  isTenant: Joi.boolean().required(),
  tokenAdvance: Joi.number().required(),
  commision: Joi.number().required(),
  moveInDate: Joi.string(),
  moveOutDate: Joi.string(),
});

const adminlogin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const createOwner = Joi.object({
  fname: Joi.string().required(),
  email: Joi.string().lowercase().email().required(),
  mobile: Joi.string().length(10).required(),
  aadhaar: Joi.number().min(12).required(),
  pan: Joi.string().length(10).required(),
  bankName: Joi.string().required(),
  bankAccountNo: Joi.number().required(),
  bankIfsc: Joi.string().required(),
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

const addCategory = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
});

const updateCategory = Joi.object({
  categoryId: Joi.string().required(),
  name: Joi.string().required(),
});

const deleteCategory = Joi.object({
  categoryId: Joi.string().required(),
});

const addService = Joi.object({
  name: Joi.string().required(),
  categoryId: Joi.string().required(),
  servicableCities: Joi.string().required(),
  paymentModes: Joi.array().required().required(),
  price: Joi.string().required(),
});

export default {
  adminCreate,
  adminlogin,
  saveUserTenant,
  createOwner,
  saveInventory,
  addCategory,
  updateCategory,
  deleteCategory,
  addService,
};
