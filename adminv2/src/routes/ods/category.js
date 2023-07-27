import * as controller from "../../controllers/ods/category.js";
import Router from "express";
import validation from "../../validation/admin.js";
import { validate } from "../../../../shared/utils/helper.js";

const router = Router();

//category
router
  .route("/")
  .get(controller.getCategory)
  .post(validate(validation.addCategory), controller.createCategory)
  .patch(validate(validation.updateCategory), controller.updateCategory)
  .delete(validate(validation.deleteCategory), controller.deleteCategory);

router.route("/:categoryId").get(controller.getCategoryById);

export default router;
