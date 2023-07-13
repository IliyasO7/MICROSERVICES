import Joi from "joi";

const adminCreate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().lowercase().email().required(),
    role:  Joi.string().required(),

  });

  const saveUserTenant = Joi.object({
    fname: Joi.string().required(),
    email: Joi.string().lowercase().email().required(),
    mobile: Joi.string().length(10).required(),
    inventoryId :  Joi.string().required(),
    isTenant: Joi.boolean().required(),
    tokenAdvance:Joi.number().required(),
    //moveIdDate:Joi.date().required(),
  });

  const adminlogin = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const saveUserOwner = Joi.object({
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
  
export default {
  adminCreate,
  adminlogin,
  saveUserTenant,
  saveUserOwner
};
