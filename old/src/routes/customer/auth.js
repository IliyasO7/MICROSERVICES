const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const customerAuthController = require('../../controllers/customer/auth')

// Signup
router.post(
  '/signup',
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('email').isEmail().toLowerCase().notEmpty().withMessage('Invalid E-mail address'),
    body('phone').notEmpty().withMessage('Invalid phone number')
  ],
  checkValidation,
  customerAuthController.signup
)

// Send login OTP
router.post(
  '/send-otp',
  [
    body('phone').notEmpty().withMessage('Phone number is required')
  ],
  checkValidation,
  customerAuthController.sendLoginOtp
)

// Verify login OTP
router.post(
  '/verify-otp',
  [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('otp').notEmpty().withMessage('OTP code is required').isNumeric().withMessage('OTP should be a number')
  ],
  checkValidation,
  customerAuthController.verifyLoginOtp
)

// Get profile
router.get(
  '/profile',
  auth.isLoggedIn,
  customerAuthController.profile
)

// Update profile
router.post(
  '/profile',
  auth.isLoggedIn,
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('email').isEmail().toLowerCase().notEmpty().withMessage('Invalid E-mail address'),
    body('phone').notEmpty().withMessage('Invalid phone number')
  ],
  checkValidation,
  customerAuthController.updateProfile
)

// Update password
router.post(
  '/password',
  auth.isLoggedIn,
  [
    body('password').notEmpty().withMessage('Invalid password')
  ],
  checkValidation,
  customerAuthController.updatePassword
)

module.exports = router