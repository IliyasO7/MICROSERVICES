import * as controller from "../controllers/auth.js"
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";

const router = Router();

router.post('/login',
validate(validation.adminlogin),
controller.loginAdmin);

//create Super admin
router
  .route('/create-super-admin') 
  .post(validate(validation.adminCreate), controller.createSuperAdmin)

export default router;