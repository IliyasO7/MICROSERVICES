import joi from 'joi';

export const createCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
  videos: joi.array().items(joi.string()),
  catalog: joi.string().required(),
});

export const updateCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
  videos: joi.array().items(joi.string()),
  catalog: joi.string(),
});
