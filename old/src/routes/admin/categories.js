const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../../middlewares/auth')
const checkValidation = require('../../middlewares/checkValidation')

// Controllers
const categoriesController = require('../../controllers/admin/categories')

// Add category
router.post(
  '/',
  auth.isAdmin,
  [
    body('name').notEmpty().withMessage('Invalid name'),
    body('type').notEmpty().isSlug().withMessage('Invalid type')
  ],
  checkValidation,
  categoriesController.add
)

// Update category
router.post(
  '/:categoryId',
  auth.isAdmin,
  [
    body('name').notEmpty().withMessage('Invalid name')
  ],
  checkValidation,
  categoriesController.update
)

// Delete category
router.delete(
  '/:categoryId',
  auth.isAdmin,
  categoriesController.delete
)

module.exports = router