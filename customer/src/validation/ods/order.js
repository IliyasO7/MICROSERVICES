import joi from 'joi';

export const createOrder = joi.object({
  cartId: joi.string().required(),
  addressId: joi.string().required(),
  date: joi.string().required(),
  time: joi.string().required(),
  tipAmount: joi.number().default(0),
});

export const confirmOrder = joi.object({
  orderId: joi.string().required(),
  paymentId: joi.string().required(),
  paymentSignature: joi.string().required(),
});
