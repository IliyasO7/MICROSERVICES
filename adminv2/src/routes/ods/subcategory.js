import { Router } from "express";
import * as controller from "../../controllers/ods/subcategory.js";
import * as validation from "../../validation/ods/category.js";
import { validate } from "../../../../shared/utils/helper.js";

const router = Router();

router
  .route("/")
  .get(controller.getSubCategory)
  .post(validate(validation.createSubCategory), controller.createSubCategory);

router
  .route("/:id")
  .get(controller.getSubCategoryById)
  .patch(validate(validation.updateSubCategory), controller.updateSubCategory)
  .delete(controller.deleteSubCategory);

/*
router
  .route("/:id")
  .get(controller.getCategoryById)
  .patch(validate(validation.updateCategory), controller.updateCategory)
  .delete(controller.deleteCategory);
*/

export default router;
