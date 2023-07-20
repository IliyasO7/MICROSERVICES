import * as controller from "../controllers/vendor.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate,checkVendorAuth } from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({dest: 'uplaod/'})

const router = Router();

router.post("/send-otp", validate(validation.sendOtp), controller.sendOtp);

router.post(
  "/verify-otp",
  validate(validation.verifYOtp),
  controller.verifyOtp
);

// Get profile
router.get(
  "/assets",
  checkAuth(),
  controller.getAssets
);

router.post(
  "/login",
  validate(validation.vendorlogin),
  controller.login
);

router.post(
  "/logout",
  controller.logOut
);

//Get profile
router.get(
  '/profile',
  checkVendorAuth(),
  controller.profile
)

//Update profile
router.post(
  '/profile',
  checkVendorAuth(),
  validate(validation.updateVendor),
  controller.updateProfile
)

// Update password
router.post(
  '/password',
  checkVendorAuth(),
  validate(validation.updatePassword),
  controller.updatePassword
)

export default router;
