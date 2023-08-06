import joi from 'joi';
import { getEnums } from '../../../shared/utils/helper.js';
import { LeadPlatform, LeadType } from '../../../shared/models/lead.js';

export const createZapierLead = joi.object({
  type: joi
    .string()
    .valid(...getEnums(LeadType))
    .required(),
  platform: joi
    .string()
    .valid(...getEnums(LeadPlatform))
    .required(),
  name: joi.string().required(),
  email: joi.string().required(),
  mobile: joi.string().required(),
  serviceName: joi.string().required(),
});
