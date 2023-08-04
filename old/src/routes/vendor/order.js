const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const vendorOrderController = require('../../controllers/vendor/order')

// Update order status
router.post(
  '/:orderId/status',
  auth.isVendor,
  [
    body('status').isIn(['accept', 'reject', 'start', 'complete', 'cancel']).withMessage('Invalid status')
  ],
  checkValidation,
  vendorOrderController.updateStatus
)

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

 // List orders
router.get(
  '/',
  auth.isVendor,
  vendorOrderController.list
)

// Get order details
router.get(
  '/:orderId',
  auth.isVendor,
  vendorOrderController.details
)

// Update order price
router.post(
  '/:orderId/updateprice',
  auth.isVendor,
  vendorOrderController.updatePrice
)

// Send Completion OTP
router.post(
  '/:orderId/sendCompletionOtp',
  auth.isVendor,
  vendorOrderController.sendJobCompletionOtp
)

// Verify Completion OTP
router.post(
  '/:orderId/verifyCompletionOtp',
  auth.isVendor,
  vendorOrderController.verifyJobCompletionOtp
)

module.exports = router

