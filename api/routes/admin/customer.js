const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const customersController = require('../../controllers/admin/customers')

// List
router.get(
  '/',
  auth.isAdmin,
  customersController.list
)

// Add customer
router.post(
  '/',
  auth.isAdmin,
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('email').isEmail().toLowerCase().notEmpty().withMessage('Invalid E-mail address'),
    body('phone').notEmpty().withMessage('Invalid phone number'),
    body('password').notEmpty().withMessage('Invalid password')
  ],
  checkValidation,
  customersController.add
)

// Get customer profile
router.get(
  '/:customerId',
  auth.isAdmin,
  customersController.profile
)

// Update customer
router.post(
  '/:customerId',
  auth.isAdmin,
  [
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('email').isEmail().toLowerCase().notEmpty().withMessage('Invalid E-mail address'),
    body('phone').notEmpty().withMessage('Invalid phone number'),
    body('note').optional({ null: true })
  ],
  checkValidation,
  customersController.update
)

// Delete customer
router.delete(
  '/:customerId',
  auth.isAdmin,
  customersController.delete
)

module.exports = router