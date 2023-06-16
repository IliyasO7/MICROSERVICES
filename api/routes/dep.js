const express = require('express')
const router = express.Router()
const fs = require('fs')

// Middlewares
const auth = require('../middlewares/auth')

// Controllers
const depController = require('../controllers/dep/dep')
const { route } = require('./services')

// List
router.get(
    '/', 
    depController.getAllLeads
  )

router.post(
  '/', 
  depController.createLead
)

// get lead by ID
router.get(
  '/leadDetails/:id',
  depController.leadDetails
)

router.patch(
    '/updateLead', 
    depController.updateLead
)

router.post(
  '/createOrder', 
  depController.createOrder
)

router.post(
  '/createFacebookleads', 
  depController.createFBLead
)

router.post(
  '/createNewLeads', 
  depController.createnewLead
)
router.get(
  '/new', 
  depController.getAllNewLeads
)

router.get(
  '/newleadDetails/:id',
  depController.newleadDetails
)

router.patch(
  '/updateNewLead', 
  depController.updatenewLead
)

router.post(
  '/createLeadOrder', 
  depController.createLeadOrder
)
module.exports = router