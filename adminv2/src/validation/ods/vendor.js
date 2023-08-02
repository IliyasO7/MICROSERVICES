import joi from 'joi';

export const createVendor = joi.object({
  businessName: joi.string().required(),
  businessType: joi.string().required(),
  address: joi.string().required(),
  gstNo: joi.string().length(15),
  gstDocument: joi.string(),
  agreementDocument: joi.string(),
  authorizedPerson: joi.object({
    name: joi.string(),
    mobile: joi.string(),
    address: joi.string(),
    password: joi.string(),
    aadhaarNo: joi.string().length(12),
    aadhaarDocument: joi.string(),
  }),
  bank: joi.object({
    accountNo: joi.string(),
    ifscCode: joi.string(),
    document: joi.string(),
  }),
  payment: joi.object({
    amount: joi.number(),
    receiptNo: joi.string(),
    document: joi.string(),
  }),
  services: joi.array().items(joi.string()),
  serviceAreas: joi.array().items(joi.string()),
});

export const updateVendor = joi.object({
  businessName: joi.string(),
  businessType: joi.string(),
  address: joi.string(),
  gstNo: joi.string(),
  gstDocument: joi.string(),
  agreementDocument: joi.string(),
  authorizedPerson: joi.object({
    name: joi.string(),
    mobile: joi.string(),
    address: joi.string(),
    password: joi.string(),
    aadhaarNo: joi.string(),
    aadhaarDocument: joi.string(),
  }),
  bank: joi.object({
    accountNo: joi.string(),
    ifscCode: joi.string(),
    document: joi.string(),
  }),
  payment: joi.object({
    amount: joi.number(),
    receiptNo: joi.string(),
    document: joi.string(),
  }),
  services: joi.array().items(joi.string()),
  serviceAreas: joi.array().items(joi.string()),
});
