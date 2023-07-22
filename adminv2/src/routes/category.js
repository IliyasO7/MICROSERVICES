import * as controller from "../controllers/category.js";

import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";


const router = Router();

router.get('/',
checkAuthAdmin(),
controller.getCategory);

router.post('/create-category',
checkAuthAdmin(),
validate(validation.addCategory),
controller.createCategory);

router.post('/update-category/:categoryId',
checkAuthAdmin(),
validate(validation.updateCategory),
controller.updateCategory);


router.delete('remove-category/:categoryId',
checkAuthAdmin(),
controller.deleteCategory);

export default router;