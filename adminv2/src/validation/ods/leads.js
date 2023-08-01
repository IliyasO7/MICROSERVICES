import joi from "joi";

export const createLeads = joi.object({
  businessName: joi.string().required(),
  businessType: joi.string().required(),
  address: joi.string().required(),
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
  serviceAreas: joi.array().items(joi.string()),
});

export const updateLeads = joi.object({
  businessName: joi.string().required(),
  businessType: joi.string().required(),
  address: joi.string().required(),
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
  serviceAreas: joi.array().items(joi.string()),
});
