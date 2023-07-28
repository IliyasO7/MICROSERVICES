import * as controller from "../controllers/tenant.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate } from "../../../shared/utils/helper.js";

const router = Router();

//create,update and get tenant
router
  .route("/")
  .get(controller.getTenants)
  .post(validate(validation.saveUserTenant), controller.createTenant);
//.patch(validate(validation.saveUserTenant), controller.updateTenant);

router.route("/:id").get(controller.getTenantById);

router.get("/:id/contracts", controller.getTenantContracts);

router.get("/:id/properties", controller.getTenantProperties);

export default router;
