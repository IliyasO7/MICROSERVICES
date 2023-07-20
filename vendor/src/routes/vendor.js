import * as controller from "../controllers/vendor.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate } from "../../../shared/utils/helper.js";
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


export default router;
