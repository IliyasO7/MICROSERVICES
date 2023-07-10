const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const multer = require('multer')
const upload = multer({dest: 'uplaods/'})


// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const vendorController = require('../../controllers/admin/vendor')

// List
router.get(
  '/',
  auth.isAdmin,
  vendorController.list
)


// List
router.get(
  '/get-vendor-services/:vendorId',
  auth.isAdmin,
  vendorController.getVendorServices
)


// Remove vendor Services
router.post(
  '/removeVendorServices/:vendorId',
  auth.isAdmin,
  vendorController.RemoveVendorServices
)


//Add Vendor Services
router.post(
  '/addVendorServices/:vendorId',
  auth.isAdmin,
  vendorController.AddVendorServices
)

// Add vendor
router.post(
  '/',
  auth.isAdmin,
  [
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('phone').trim().notEmpty().isLength({min: 10}).withMessage('Invalid phone number'),
    body('additionalPhone').trim().notEmpty().isLength({min: 10}).withMessage('Invalid additional mobile number'),
    body('password').notEmpty().withMessage('Invalid password'),
    body('homeAddress').notEmpty().withMessage('Invalid addresses'),
    body('businessName').notEmpty().withMessage('Invalid business name'),
    body('officeAddress').optional({ nullable: true }),
    body('typeOfVendor').notEmpty().withMessage('Type Of Vendor Required'),
    body('serviceProvided').notEmpty().withMessage('Invalid service provided'),
    body('teamSize').notEmpty().withMessage('Invalid team size' ),
    body('inBusinessSince').notEmpty().withMessage('Invalid Business years'),
    body('languagesKnown').notEmpty().withMessage('Invalid language known'),
    body('serviceArea').notEmpty().withMessage('Invalid service area'),
    body('aadharCardNumber').notEmpty().isNumeric().isLength({min: 12}).withMessage('Invalid aadhar card number'),
    body('bankAccountNumber').notEmpty().isNumeric().withMessage('Invalid bank account number'),
    body('bankIfscCode').notEmpty().withMessage('Invalid IFSC'),
    body('paymentReceiptNumber').notEmpty().withMessage('Invalid payment receipt number'),
  ],
  checkValidation,
  vendorController.create
)

// Update vendor media
router.post(
  '/:vendorId/media',
  auth.isAdmin,
  upload.fields([
    {
      name: 'aadhar',
      maxCount: 1
    },
    {
      name: 'bankDocument',
      maxCount: 1
    },
    {
      name: 'gstDocumentUpload',
      maxCount: 1
    },
    {
      name: 'agreementUpload',
      maxCount: 1
    },
    {
      name: 'paymentReceipt',
      maxCount: 1
    }
  ]),
  vendorController.updateMedia
)

// Get vendor profile
router.get(
  '/:vendorId',
  auth.isAdmin,
  vendorController.profile
)

// Update vendor
router.post(
  '/:vendorId',
   auth.isAdmin,

  [
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('phone').isNumeric().withMessage('Hell').notEmpty().isLength({min: 10}).withMessage('Invalid phone number'),
    body('additionalPhone').isNumeric().notEmpty().isLength({min: 10}).withMessage('Invalid additional mobile number'),
    body('homeAddress').notEmpty().withMessage('Invalid addresses'),
    body('businessName').notEmpty().withMessage('Invalid business name'),
    body('officeAddress').optional({ nullable: true }),
    body('typeOfVendor').notEmpty().withMessage('Type Of Vendor Required'),
    body('serviceProvided').notEmpty().withMessage('Invalid service provided'),
    body('teamSize').notEmpty().withMessage('Invalid team size' ),
    body('inBusinessSince').notEmpty().withMessage('Invalid Business years'),
    body('languagesKnown').notEmpty().withMessage('Invalid language known'),
    body('serviceArea').notEmpty().withMessage('Invalid service area'),
    body('aadharCardNumber').isNumeric().notEmpty().isLength({min: 12}).withMessage('Invalid aadhar card number'),
    body('bankAccountNumber').isNumeric().notEmpty().withMessage('Invalid bank account number'),
    body('bankIfscCode').notEmpty().withMessage('Invalid IFSC'),
    body('paymentReceiptNumber').notEmpty().withMessage('Invalid payment receipt number'),
    
  ],
  checkValidation,
  vendorController.update
)

// Delete vendor
router.delete(
  '/:vendorId',
  auth.isAdmin,
  vendorController.delete
)


module.exports = router