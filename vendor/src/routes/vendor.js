import * as controller from "../controllers/vendor.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate,checkVendorAuth } from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({dest: 'uplaod/'})

const router = Router();

//Send OTP
router.post("/send-otp", validate(validation.sendOtp), controller.sendOtp);

//Verify OTP
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

//login
router.post(
  "/login",
  validate(validation.vendorlogin),
  controller.login
);

//logout
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

// Update order status
router.post(
  '/:orderId/status',
  checkVendorAuth(),
  validate(validation.orderStatus),
  controller.updateOrderStatus
)


//Get List
router.get(
  '/',
  checkVendorAuth(),
  controller.list
)
// Get order details
router.get(
  '/:orderId',
  checkVendorAuth(),
  controller.orderDetails
)

//Update Order Price
router.post(
  '/:orderId/updateprice',
  checkVendorAuth(),
  controller.updatePrice
)

// Send Completion OTP
router.post(
  '/:orderId/sendCompletionOtp',
  checkVendorAuth(),
  controller.sendJobCompletionOtp
)


// Verify Job Completion OTP
router.post(
  '/:orderId/verifyCompletionOtp',
  checkVendorAuth(),
  controller.verifyJobCompletionOtp
)


/*
// Update Before Image media
router.post(
  '/:orderId/beforeJobImage',
  auth.isVendor,
  upload.fields([
    {
      name: 'beforeJobImage',
      maxCount: 1
    }
  ]),
  vendorOrderController.beforeJobImage
)

// Update After Image media
router.post(
  '/:orderId/afterJobImage',
  auth.isVendor,
  upload.fields([
    {
      name: 'afterJobImage',
      maxCount: 1
    }
  ]),
  vendorOrderController.afterJobImage
)
*/


export default router;
