import * as controller from "../controllers/admin.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuth,checkAuthAdmin } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";

const router = Router();


router.post('/login',
validate(validation.adminlogin),
controller.loginAdmin);

router.post('/create',
checkAuthAdmin(),
validate(validation.adminCreate),
controller.createAdmin);

export default router;
