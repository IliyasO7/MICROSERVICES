const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const orderController = require('../../controllers/admin/order')

// List orders
router.get(
  '/',
  auth.isAdmin,
  orderController.list
)

// Get order details
router.get(
  '/:orderId',
  auth.isAdmin,
  orderController.details
)

// Update order status
router.post(
  '/:orderId/status',
  auth.isAdmin,
  [
    body('status').notEmpty().withMessage('Invalid status')
  ],
  checkValidation,
  orderController.updateStatus
)

// Update order note
router.post(
  '/:orderId/note',
  auth.isAdmin,
  [
    body('note').notEmpty().withMessage('Invalid note')
  ],
  checkValidation,
  orderController.updateNote
)

// Assign vendor
router.post(
  '/:orderId/assignvendor',
  auth.isAdmin,
  [
    body('vendorId').notEmpty().withMessage('Vendor ID is required')
  ],
  checkValidation,
  orderController.assignVendor
)

// Delete order
router.delete(
  '/:orderId',
  auth.isAdmin,
  orderController.delete
)

module.exports = router