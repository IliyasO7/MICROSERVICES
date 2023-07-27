import * as controller from "../controllers/tenant.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate } from "../../../shared/utils/helper.js";

const router = Router();

//create,update and get tenant
router
  .route("/")
  .get(controller.getAdminTenants)
  .post(validate(validation.saveUserTenant), controller.createTenant);
//.patch(validate(validation.saveUserTenant), controller.updateTenant);

//get all tenants
router.route("/all").get(controller.getAllTenants);

//Get Tenant with number
router.route("/:mobile").get(controller.getTenant);

export default router;
