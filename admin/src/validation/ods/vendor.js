import joi from 'joi';
import validators from '../../../../shared/utils/validators.js';

export const createVendor = joi.object({
  businessName: joi.string().required(),
  businessType: joi.string().required(),
  address: joi.string().required(),
  gstNo: joi.string().length(15),
  gstDocument: validators.fileKey('vendors/gst'),
  agreementDocument: validators.fileKey('vendors/agreements'),
  authorizedPerson: joi.object({
    name: joi.string(),
    mobile: joi.string(),
    address: joi.string(),
    password: joi.string(),
    aadhaarNo: joi.string().length(12),
    aadhaarDocument: validators.fileKey('vendors/aadhaar'),
  }),
  bank: joi.object({
    accountNo: joi.string(),
    ifscCode: joi.string(),
    document: validators.fileKey('vendors/passbooks'),
  }),
  payment: joi.object({
    amount: joi.number(),
    receiptNo: joi.string(),
    document: validators.fileKey('vendors/cheques'),
  }),
  services: joi.array().items(validators.objectId()),
  serviceAreas: joi.array().items(joi.string()),
});

export const updateVendor = joi.object({
  businessName: joi.string(),
  businessType: joi.string(),
  address: joi.string(),
  gstNo: joi.string(),
  gstDocument: validators.fileKey('vendors/gst').allow(''),
  agreementDocument: validators.fileKey('vendors/agreements').allow(''),
  authorizedPerson: joi.object({
    name: joi.string(),
    mobile: joi.string(),
    address: joi.string(),
    password: joi.string(),
    aadhaarNo: joi.string(),
    aadhaarDocument: validators.fileKey('vendors/aadhaar').allow(''),
  }),
  bank: joi.object({
    accountNo: joi.string(),
    ifscCode: joi.string(),
    document: validators.fileKey('vendors/passbooks').allow(''),
  }),
  payment: joi.object({
    amount: joi.number(),
    receiptNo: joi.string(),
    document: validators.fileKey('vendors/cheques').allow(''),
  }),
  services: joi.array().items(validators.objectId()),
  serviceAreas: joi.array().items(joi.string()),
});

export const assignVendor = joi.object({
  vendorId: validators.objectId().required(),
});
