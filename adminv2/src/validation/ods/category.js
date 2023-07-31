import joi from "joi";

export const createCategory = joi.object({
  name: joi.string().required(),
  image: joi.string(),
});

export const updateCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
});

export const createSubCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
  videos: joi.array().items(joi.string()),
  category: joi.string().required(),
});

export const updateSubCategory = joi.object({
  name: joi.string(),
  image: joi.string(),
  videos: joi.array().items(joi.string()),
  category: joi.string(),
});
