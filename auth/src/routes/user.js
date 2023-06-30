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

export default router;
