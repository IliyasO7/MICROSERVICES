import * as controller from "../controllers/admin.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuth,checkAuthAdmin } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";

const router = Router();


router.post('/create-super-admin',
validate(validation.adminCreate),
controller.createSuperAdmin);


router.post('/login',
validate(validation.adminlogin),
controller.loginAdmin);

router.post('/create-ods-admin',
checkAuthAdmin(),
validate(validation.adminCreate),
controller.createOdsAdmin);

router.post('/create-rental-admin',
checkAuthAdmin(),
validate(validation.adminCreate),
controller.createRentalAdmin);


export default router;
