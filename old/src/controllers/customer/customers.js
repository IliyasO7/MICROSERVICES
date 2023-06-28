const mongoose = require('mongoose')
const dayjs = require('dayjs')
const _ = require('lodash')

// Models
const Customer = require('../../models/customer')
const Service = require('../../models/service')

// Services
const customersService = require('../../services/customers')

// Add address
exports.addAddress = async (req, res, next) => {
  try {

    let addAddress = await customersService.addAddress(req.userData.customerId, {
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country
    }, req.body.default)

    res.status(200).json({
      result: 'success',
      message: 'Address added successfully'
    })

  } catch (err) {
    next(err)
  }
}

// Set default address
exports.setDefaultAddress = async (req, res, next) => {
  try {

    await customersService.setDefaultAddress(req.userData.customerId, req.body.addressId)

    res.status(200).json({
      result: 'success',
      message: 'Default address updated'
    })

  } catch (err) {
    next(err)
  }
}

// Delete address
exports.deleteAddress = async (req, res, next) => {
  try {

    await customersService.deleteAddress(req.userData.customerId, req.params.addressId)

    res.status(200).json({
      result: 'success',
      message: 'Address deleted successfully'

    })
  
  } catch (err) {
    next(err)
  }
}

