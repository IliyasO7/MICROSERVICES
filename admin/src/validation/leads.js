import joi from 'joi';

export const leadToOrder = joi.object({
    packageId: joi.string().required(),
    subPackageId: joi.string().allow(''),
    date: joi.string().required(),
    time: joi.string().required(),
    fname: joi.string().required(),
    lname: joi.string().required(),
    mobile: joi.string().length(10),
    line1: joi.string().required(),
    line2: joi.string().allow(''),
    landmark: joi.string().allow(''),
    city: joi.string().lowercase().required(),
    state: joi.string().lowercase().required(),
    pincode: joi.string().length(6).required(),
  });
