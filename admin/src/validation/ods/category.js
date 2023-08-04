import joi from 'joi';

export const createCategory = joi.object({
  name: joi.string().required(),
  image: joi.string(),
});

export const updateCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
});
