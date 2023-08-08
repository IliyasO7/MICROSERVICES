import joi from 'joi';
import { getEnums } from '../../../../shared/utils/helper.js';
import { ServiceCategory } from '../../../../shared/utils/constants.js';
import validators from '../../../../shared/utils/validators.js';

export const createService = joi.object({
  name: joi.string(),
  icon: validators.fileKey('services/icons'),
  images: joi.array().items(validators.fileKey('services/images')),
  videos: joi.array().items(validators.fileKey('services/videos')),
  category: joi
    .string()
    .valid(...getEnums(ServiceCategory))
    .required(),
  hsn: joi.string().required(),
  taxPercentage: joi.number().required(),
});

export const updateService = joi.object({
  name: joi.string(),
  icon: validators.fileKey('services/icons').allow(''),
  images: joi.array().items(validators.fileKey('services/images')),
  videos: joi.array().items(validators.fileKey('services/videos')),
  category: joi.string().valid(...getEnums(ServiceCategory)),
  hsn: joi.string(),
  taxPercentage: joi.number(),
});
