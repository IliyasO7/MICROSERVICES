import * as controller from "../controllers/user.js";
import Router from "express";
// import validation from "../validation/user.js";

const router = Router();

router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

export default router;
