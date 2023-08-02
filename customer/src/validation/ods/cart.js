import joi from 'joi';

export const addItem = joi.object({
  packageId: joi.string().required(),
  subPackageId: joi.string().allow(''),
});

export const removeItem = joi.object({
  packageId: joi.string().required(),
  subPackageId: joi.string().allow(''),
});

export const clearCart = joi.object({
  cartId: joi.string().allow(''),
});
