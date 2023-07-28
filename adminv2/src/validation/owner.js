import joi from 'joi';

export const createOwner = joi.object({
  fname: joi.string().required(),
  email: joi.string().lowercase().email().required(),
  mobile: joi.string().length(10).required(),
  pan: joi.string().length(10).required(),
  aadhaar: joi.number().min(12).required(),
  bankName: joi.string().required(),
  bankAccountNo: joi.number().required(),
  bankIfsc: joi.string().required(),
});
