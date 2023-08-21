import Router from "express";
import * as controller from "../controllers/auth.js";
import * as validation from "../validation/auth.js";
import { validate } from "../../../shared/utils/helper.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

router.post("/register", validate(validation.register), controller.register);
router.post("/login", validate(validation.login), controller.login);
router.get("/profile", checkAuth(), controller.profile);

export default router;
