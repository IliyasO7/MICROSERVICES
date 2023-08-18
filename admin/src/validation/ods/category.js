import joi from "joi";
import validators from "../../../../shared/utils/validators.js";

export const createCategory = joi.object({
  name: joi.string().required(),
  icon: validators.fileKey("category/images"),
  serviceCount: joi.number(),
  orderCount: joi.number(),
});

export const updateCategory = joi.object({
  name: joi.string(),
  image: validators.fileKey("category/images"),
  serviceCount: joi.number(),
  orderCount: joi.number(),
});
