import joi from 'joi';

export const createTenant = joi.object({
  fname: joi.string().required(),
  email: joi.string().lowercase().email().required(),
  mobile: joi.string().length(10).required(),
  propertyId: joi.string().required(),
  isTenant: joi.boolean().required(),
  tokenAdvance: joi.number().required(),
  commission: joi.number().required(),
  moveInDate: joi.string(),
  moveOutDate: joi.string(),
});
