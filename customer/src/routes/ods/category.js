import { Router } from "express";
import * as controller from "../../controllers/ods/category.js";

const router = Router();

router.route("/").get(controller.getCategories);

router.route("/:id").get(controller.getCategoryById);

export default router;
