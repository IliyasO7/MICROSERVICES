const express = require('express')
const router = express.Router()
const fs = require('fs')

// Controllers
const serviceController = require('../controllers/admin/service')

// List
router.get(
  '/',
  serviceController.list
)

// Get service areas
router.get(
  '/areas',
  async (req, res, next) => {
    res.send({
      result: 'success',
      areas: JSON.parse(fs.readFileSync('uploads/serviceAreas.json').toString())
    })
  }
)

// Get service details
router.get(
  '/:slug',
  serviceController.get
)

module.exports = router