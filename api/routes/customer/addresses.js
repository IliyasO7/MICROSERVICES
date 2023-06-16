const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const customersController = require('../../controllers/customer/customers')

// Add address
router.post(
  '/',
  auth.isLoggedIn,
  [
    body('default').optional({nullable: true}).isBoolean().withMessage('Invalid default value'),
    body('fname').notEmpty().withMessage('Invalid first name'),
    body('lname').notEmpty().withMessage('Invalid last name'),
    body('phone').notEmpty().withMessage('Invalid phone number'),
    body('address').notEmpty().withMessage('Invalid address'),
    body('city').notEmpty().withMessage('Invalid city'),
    body('state').notEmpty().withMessage('Invalid state'),
    body('pincode').notEmpty().withMessage('Invalid pincode').isLength({ min: 6 }).withMessage('Invalid pincode'),
    body('country').isISO31661Alpha2().withMessage('Invalid country').toLowerCase().notEmpty().withMessage('Invalid country')
  ],
  checkValidation,
  customersController.addAddress
)

// Set default address
router.post(
  '/setdefault',
  auth.isLoggedIn,
  [
    body('addressId').notEmpty().withMessage('Invalid address ID')
  ],
  checkValidation,
  customersController.setDefaultAddress
)

// Delete address
router.delete(
  '/:addressId',
  auth.isLoggedIn,
  customersController.deleteAddress
)

module.exports = router