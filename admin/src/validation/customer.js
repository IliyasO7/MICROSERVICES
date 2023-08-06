import joi from 'joi';

export const updateCustomer = joi.object({
  fname: joi.string(),
  lname: joi.string(),
  email: joi.string().email(),
});
