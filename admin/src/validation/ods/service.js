import joi from 'joi';
import { getEnums } from '../../../../shared/utils/helper.js';
import { ServiceCategory } from '../../../../shared/utils/constants.js';

export const createService = joi.object({
  name: joi.string(),
  icon: joi.string().allow(''),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  category: joi
    .string()
    .valid(...getEnums(ServiceCategory))
    .required(),
  hsn: joi.string().required(),
  taxPercentage: joi.number().required(),
});

export const updateService = joi.object({
  name: joi.string(),
  icon: joi.string().allow(''),
  images: joi.array().items(joi.string()),
  videos: joi.array().items(joi.string()),
  category: joi.string().valid(...getEnums(ServiceCategory)),
  hsn: joi.string(),
  taxPercentage: joi.number(),
});
