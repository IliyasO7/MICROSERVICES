import joi from 'joi';

export const register = joi.object({
  fname: joi.string().required(),
  lname: joi.string().required(),
  email: joi.string().email().required(),
  username: joi.string().required(),
  role: joi.string(),
  password: joi.string().required(),
});

export const login = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});
