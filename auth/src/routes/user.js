import * as controller from "../controllers/user.js";
import Router from "express";
import validation from "../validation/user.js";
import { validate } from "../../../shared/utils/helper.js";

const router = Router();

router.post("/send-otp", validate(validation.sendOtp), controller.sendOtp);
router.post(
  "/verify-otp",
  validate(validation.verifYOtp),
  controller.verifyOtp
);

// Signup
router.post(
  '/signup',
  validate(validation.signUp),
  controller.signUp
)

// Get profile by ID
router.get(
  '/profile/:cId',
 // isLoggedIn,
  controller.getprofile
)

export default router;
