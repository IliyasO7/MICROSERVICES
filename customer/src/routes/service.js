import { Router } from "express";
import * as controller from "../controllers/ods/service.js";

const router = Router();

router.route("/").get(controller.getServices);

router.route("/:id").get(controller.getServiceById);

export default router;
