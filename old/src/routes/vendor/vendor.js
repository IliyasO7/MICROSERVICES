const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const multer = require('multer')
const upload = multer()

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const vendorController = require('../../controllers/vendor/vendor')

// Login
router.post(
  '/login',
  [
    body('phone').notEmpty().withMessage('Invalid phone'),
    body('password').notEmpty().withMessage('Invalid password'),
    body('fcmToken').notEmpty().withMessage('FCM token is required')
  ],
  checkValidation,
  vendorController.login
)

// Logout
router.get('/logout', (req, res, next) => {
  res.status(200).json({
    result: 'success'
  })
})

// Get profile
router.get(
  '/profile',
  auth.isLoggedIn,
  vendorController.profile
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


module.exports = router
