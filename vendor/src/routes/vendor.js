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


router.get(
  "/logout",
  controller.logOut
);



// Get profile
router.get(
  '/profile',
  checkVendorAuth(),
  controller.profile
)


// Update profile
router.post(
  '/profile',
  checkVendorAuth(),
  validate(validation.updateVendor),
  controller.updateProfile
)

// Update profile
router.post(
  '/profile',
  auth.isLoggedIn,
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('phone').notEmpty().withMessage('Invalid phone number'),
    body('additionalMobileNumber').notEmpty().withMessage('Invalid additional mobile number'),
    body('password').notEmpty().withMessage('Invalid password'),
    // body('addresses').notEmpty().withMessage('Invalid addresses'),
    // body('country').notEmpty().withMessage('Invalid country'),
    // body('businessName').notEmpty().withMessage('Invalid business name'),
    // body(' officeAddress').withMessage('Invalid office address'),
    // body('serviceProvided').notEmpty().withMessage('Invalid service provided'),
    // body('teamSize').notEmpty().withMessage('Invalid team size' ),
    // body('inBusinessSince').notEmpty().withMessage('Invalid Business years'),
    // body('languageKnown').notEmpty().withMessage('Invalid language known'),
    // body('serviceArea').notEmpty().withMessage('Invalid service area'),
    // body('hub').notEmpty().withMessage('Invalid hub'),
    // body('aadharCardNumber').notEmpty().withMessage('Invalid aadhar card number'),
    // body('aadhar').notEmpty().withMessage('Invalid aadhar upload'), // aadhar doc upload
    // body('bankAccountNumber').notEmpty().withMessage('Invalid bank account number'),
    // body('ifsc').notEmpty().withMessage('Invalid IFSC'),
    // body('bankDocument').notEmpty().withMessage('Invalid bank document'),
    // body('gst').notEmpty().withMessage('Invalid GST'),
    // body('gstDocumentUpload').withMessage('Invalid GST document upload'), // gst doc upload
    // body('agreementUpload').notEmpty().withMessage('Invalid agreement upload'), // agreement upload
    // body('paymentReciept').notEmpty().withMessage('Invalid payment reciept upload'), // payment reciept upload
  ],
  checkValidation,
  vendorController.updateProfile
)

// Update password
router.post(
  '/password',
  auth.isLoggedIn,
  [
    body('password').notEmpty().withMessage('Invalid password')
  ],
  checkValidation,
  vendorController.updatePassword
)

export default router;
