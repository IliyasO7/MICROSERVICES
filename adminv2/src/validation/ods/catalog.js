import joi from 'joi';

export const createCatalog = joi.object({
  name: joi.string().required(),
  image: joi.string(),
});

export const updateCatalog = joi.object({
  name: joi.string(),
  image: joi.string(),
});
