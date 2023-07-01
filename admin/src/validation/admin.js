import Joi from "joi";

const adminCreate = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().lowercase().email().required(),
    role:  Joi.string().required(),

  });
  
export default {
  adminCreate
};
