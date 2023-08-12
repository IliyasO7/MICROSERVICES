import joi from 'joi';
import validators from '../../../../shared/utils/validators.js';

export const createContract = joi.object({
  propertyId: validators.objectId().required(),
  tenantId: validators.objectId().required(),
  moveInDate: validators.date().required(),
  moveOutDate: validators.date(),
  tokenAmount: joi.number().required(),
  commissionPercentage: joi.number().required(),
});

export const updateContract = joi.object({
  moveInDate: validators.date().required(),
  moveOutDate: validators.date(),
  tokenAmount: joi.number(),
  commissionPercentage: joi.number(),
});
