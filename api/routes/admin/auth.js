const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const authController = require('../../controllers/admin/auth')

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Invalid username'),
    body('password').notEmpty().withMessage("Invalid PW")
  ],
  checkValidation,
  authController.login
)

// Get profile
router.get(
  '/profile',
  auth.isAdmin,
  authController.profile
)

// Update profile
router.post(
  '/profile',
  auth.isAdmin,
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('username').notEmpty().withMessage('Invalid username'),
    body('email').toLowerCase().isEmail().notEmpty().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Invalid password')
  ],
  checkValidation,
  authController.updateProfile
)

module.exports = router