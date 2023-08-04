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

// Update order status
router.post(
  '/:orderId/pauseStatus',
  auth.isAdmin,
  [
    body('paused').notEmpty().withMessage('Invalid status')
  ],
  checkValidation,
  orderController.updatePause
)

// Update order note
router.post(
  '/:orderId/note',
  auth.isAdmin,
  orderController.createNote
)

// Update order note
router.get(
  '/:orderId/note',
  auth.isAdmin,
  orderController.getNotes
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

// Update order status
router.post(
  '/reschedule/:orderId',
  [
    body('serviceDate').notEmpty().withMessage('serviceDate is required'),
    body('serviceTime').notEmpty().withMessage('serviceTime is required'),
  ],
  checkValidation,
  auth.isAdmin,
  orderController.rescheduleJob
)

// Update order status
router.get(
  '/reschedule/:orderId',
  auth.isAdmin,
  orderController.getRescheduleJob
)

module.exports = router