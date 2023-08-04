import joi from 'joi';

const descriptionList = joi.array().items(
  joi.object({
    title: joi.string().allow(''),
    description: joi.string().required(),
    image: joi.string().allow(''),
  })
);

export const subPackage = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi.object({
    short: joi.string(),
    included: descriptionList,
    excluded: descriptionList,
  }),
  service: joi.string(),
  price: joi.number().required(),
  time: joi.number().required(),
  maxQuantity: joi.number().allow(null),
});

export const createPackage = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi
    .object({
      short: joi.string(),
      included: descriptionList.required(),
      excluded: descriptionList.required(),
    })
    .required(),
  service: joi.string().required(),
  price: joi.number().required(),
  time: joi.number().required(),
  maxQuantity: joi.number().allow(null),
  subPackages: joi.array().items(subPackage),
});

export const updatePackage = joi.object({
  name: joi.string().required(),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  description: joi.object({
    short: joi.string(),
    included: descriptionList,
    excluded: descriptionList,
  }),
  service: joi.string(),
  price: joi.number(),
  time: joi.number(),
  maxQuantity: joi.number().allow(null),
  subPackages: joi.array().items(subPackage),
});
