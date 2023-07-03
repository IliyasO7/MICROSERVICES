import * as controller from "../controllers/user.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate ,checkAuthAdmin} from "../../../shared/utils/helper.js";
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

//add Bank Details
router.post(
  "/bank-details", 
  checkAuth(),
  validate(validation.bankInfo),
  controller.addBankDetails);

//update Bank Details
router.post(
  "/update-bank-details", 
  checkAuth(),
  validate(validation.bankInfo),
  controller.updateBankDetails);

//get Bank Details
 router.get(
  "/get-bank-details", 
  checkAuth(),
  controller.getBankDetails);

//add Uid And Pan Number
router.post(
  "/uid-details", 
  checkAuth(),
  validate(validation.uid),
  controller.addUid);

//get Uid
router.get(
  "/uid-details", 
  checkAuth(),
  controller.getUidDetails);

  router.post(
    "/save-owner", 
    checkAuthAdmin(),
    validate(validation.saveOwner),
    controller.saveOwner);

export default router;
