import * as controller from "../controllers/tenant.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";

const router = Router();

//Get Tenant with number
router
  .route('/get-tenant/:mobile')
  .get(controller.getTenant)


//create,update and get tenant 
router
  .route('/') 
  .get(controller.getAdminTenants)
  .post(validate(validation.saveUserTenant), controller.createTenant)
  .patch(validate(validation.saveUserTenant), controller.updateTenant);

//get all tenants
router
  .route('/all-tenants') 
  .get(controller.getAllTenants)

export default router;