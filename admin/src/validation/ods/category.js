import joi from 'joi';
import validators from '../../../../shared/utils/validators.js';

export const createCategory = joi.object({
  name: joi.string().required(),
  image: validators.fileKey('category/images'),
});

export const updateCategory = joi.object({
  name: joi.string(),
  image: validators.fileKey('category/images'),
});
