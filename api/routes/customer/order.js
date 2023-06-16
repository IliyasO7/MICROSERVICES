const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const orderController = require('../../controllers/customer/order')

// List orders
router.get(
  '/',
  auth.isLoggedIn,
  orderController.list
)

// Get order details
router.get(
  '/:orderId',
  auth.isLoggedIn,
  orderController.details
)

// Verify COUPON
router.post(
  '/verify/:orderId',
  auth.isLoggedIn,
  orderController.coupon
)

// Create order
router.post(
  '/',
  auth.isLoggedIn,
  [
    body('serviceId').notEmpty().withMessage('ServiceId is required'),
    body('isFinal').isBoolean()
  ],
  checkValidation,
  orderController.create
)

// Delete order
router.delete(
  '/:orderId',
  auth.isLoggedIn,
  orderController.delete
)

// Cancel order
router.post(
  '/:orderId/cancel',
  auth.isLoggedIn,
  [
    body('reason').notEmpty().withMessage('Reason is required')
  ],
  checkValidation,
  orderController.cancel
)

// order feedback
router.post(
  '/feedback/:orderId',
  auth.isLoggedIn,
  [
    body('service').notEmpty().withMessage('send service ratings'),
    body('behaviour').notEmpty().withMessage('send cleanliness ratings'),
    body('cleaning').notEmpty().withMessage('send overall rating')
  ],
  checkValidation,
  orderController.feedback
)

module.exports = router