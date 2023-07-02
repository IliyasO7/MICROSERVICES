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

// Get profile
router.get(
  "/profile",
  checkAuth(),
  controller.getprofile
);

// Add Address
router.post(
  "/addAddress",
  checkAuth(),
  validate(validation.address),
  controller.addAddress
);

//Update Address
router.post(
  "/updateAddress",
  checkAuth(),
  validate(validation.address),
  controller.updateAddress
);

//get User Address
router.get(
  "/getAddress",
  checkAuth(),
  controller.getAddress
);

// Set default address
router.post(
  '/setdefaultAddress',
  checkAuth(),
  validate(validation.setDefault),
  controller.setDefaultAddress
)

//Delete address
router.delete(
  '/deleteAddress/:addressId',
  checkAuth(),
  controller.deleteAddress
)

//Update User Role
router.post(
  '/update-role',
  checkAuth(),
  validate(validation.userRoles),
  controller.userRoleUpdate
)

export default router;
