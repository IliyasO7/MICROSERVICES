import joi from 'joi';
export const payUPayload = joi.object({
    txnid:joi.string().required(),
    amount: joi.number().required(),
    productinfo:joi.string().required(),
    firstname:joi.string().required(),
    email:joi.string().required(),
  });
  

  export const payUResponse = joi.object({
    txnid:joi.string().required(),
    amount: joi.number().required(),
    productinfo:joi.string().required(),
    firstname:joi.string().required(),
    email:joi.string().required(),
  });
  