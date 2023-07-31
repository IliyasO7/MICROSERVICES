import joi from 'joi';

const descriptionList = joi.array().items(
  joi.object({
    title: joi.string().allow(''),
    description: joi.string().required(),
    image: joi.string(),
  })
);

export const subService = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi.object({
    short: joi.string(),
    included: descriptionList,
    excluded: descriptionList,
  }),
  category: joi.string(),
  subcategory: joi.string(),
  price: joi.number().required(),
  time: joi.number().required(),
  maxQuantity: joi.number().allow(null),
});

export const createService = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi.object({
    short: joi.string(),
    included: descriptionList,
    excluded: descriptionList,
  }),
  category: joi.string().required(),
  subcategory: joi.string().required(),
  price: joi.number().required(),
  time: joi.number().required(),
  maxQuantity: joi.number().allow(null),
  subServices: joi.array().items(subService),
});

export const updateService = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi.object({
    short: joi.string(),
    included: descriptionList,
    excluded: descriptionList,
  }),
  category: joi.string(),
  subcategory: joi.string(),
  price: joi.number(),
  time: joi.number(),
  maxQuantity: joi.number().allow(null),
  subServices: joi.array().items(subService),
});
