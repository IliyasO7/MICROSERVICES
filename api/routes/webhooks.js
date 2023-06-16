const express = require('express')
const router = express.Router()
const fs = require('fs')

// Controllers
const payuController = require('../controllers/webhooks/payu')

//Payu success
router.post(
  '/payu/success-hsUYRT8758kJFgihgd5sYJtri',
  payuController.success
)

module.exports = router