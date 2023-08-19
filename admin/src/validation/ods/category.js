import joi from 'joi';
import validators from '../../../../shared/utils/validators.js';

export const createCategory = joi.object({
  name: joi.string().required(),
  icon: validators.fileKey('category/images'),
});

export const updateCategory = joi.object({
  name: joi.string(),
  icon: validators.fileKey('category/images'),
});
