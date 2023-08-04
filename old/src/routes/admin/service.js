const express = require('express');
const router = express.Router();
const { body, check } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middlewares
const auth = require('../../middlewares/auth');
const checkValidation = require('../../middlewares/checkValidation');

// Controllers
const serviceController = require('../../controllers/admin/service');

// List
router.get('/', auth.isAdmin, serviceController.list);

// Add service
router.post(
  '/',
  auth.isAdmin,
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('category').notEmpty().withMessage('Service category is required'),
    body('servicableCities')
      .isArray()
      .withMessage('Servicable cities are required in an array'),
    body('paymentModes')
      .isArray()
      .withMessage('Payment modes are required in an array'),
    body('price').notEmpty().withMessage('Service price is required'),
  ],
  checkValidation,
  serviceController.create
);

// Get service
router.get('/:serviceId', auth.isAdmin, serviceController.service);

// Update service
router.post(
  '/:serviceId',
  auth.isAdmin,
  [
    body('name').notEmpty().withMessage('Service name is required'),
    body('category').notEmpty().withMessage('Service category is required'),
    body('servicableCities')
      .isArray()
      .withMessage('Servicable cities are required in an array'),
    body('paymentModes')
      .isArray()
      .withMessage('Payment modes are required in an array'),
    body('price').notEmpty().withMessage('Service price is required'),
  ],
  checkValidation,
  serviceController.update
);

// Update service media
router.post(
  '/:serviceId/media',
  auth.isAdmin,
  upload.fields([
    {
      name: 'icon',
      maxCount: 1,
    },
    {
      name: 'banners',
      maxCount: 12,
    },
    {
      name: 'priceGuide',
      maxCount: 1,
    },
  ]),
  serviceController.updateMedia
);

// Delete service
router.delete('/:serviceId', auth.isAdmin, serviceController.delete);

module.exports = router;
