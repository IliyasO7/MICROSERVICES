import * as controller from "../controllers/auth.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate } from "../../../shared/utils/helper.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

router.post("/login", validate(validation.adminlogin), controller.loginAdmin);

//create Super admin
router
  .route("/create-super-admin")
  .post(validate(validation.adminCreate), controller.createSuperAdmin);

router.post(
  "/create-ods-admin",
  checkAuth(),
  validate(validation.adminCreate),
  controller.createOdsAdmin
);

router.post(
  "/create-rental-admin",
  checkAuth(),
  validate(validation.adminCreate),
  controller.createRentalAdmin
);

export default router;
