import * as controller from "../../controllers/ods/services.js";
import Router from "express";
import validation from "../../validation/admin.js";
import { validate, checkAuthAdmin } from "../../../../shared/utils/helper.js";
import fs from "fs";
import multer from "multer";

const router = Router();

//list
router
  .route("/")
  .get(controller.getServices)
  .post(validate(validation.addService), controller.createService);
//  .patch(validate(validation.addService), controller.updateService)
//.delete(validate(validation.deleteService), controller.deleteService)

//Service By Id
router.route("/:serviceId").get(controller.getServiceById);

export default router;
