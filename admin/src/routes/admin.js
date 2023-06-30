import * as controller from "../controllers/admin.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";

const router = Router();

router.post('/create', validate(validation.adminCreate), controller.createAdmin);

export default router;
