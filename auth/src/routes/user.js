import * as controller from "../controllers/user.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";

const router = Router();

router.post("/send-otp", validate(validation.sendOtp), controller.sendOtp);
router.post(
  "/verify-otp",
  validate(validation.verifYOtp),
  controller.verifyOtp
);

// Signup
router.post(
  "/register",
  checkAuth(),
  validate(validation.updateProfile),
  controller.updateProfile
);

// Get profile by ID
router.get(
  "/profile",
  checkAuth(),
  controller.getprofile
);

export default router;
