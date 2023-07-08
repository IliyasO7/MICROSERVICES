const _ = require('lodash')

// Models
const Customer = require('../../models/customer')
const Order = require('../../models/order')

// Services
const customersService = require('../../services/customers')

// List
exports.list = async (req, res, next) => {
  try {

    let customers = await Customer.find({}, 'fname lname email phone status createdAt').lean()

    res.status(200).json({
      result: 'success',
      count: customers.length,
      customers: customers
    })

  } catch (err) {
    next(err)
  }
}

// Add customer
exports.add = async (req, res, next) => {
  try {

    // Check if customer is already registered
    let customer = await Customer.findOne({ email: req.body.email })
    if (customer) {
      throw {
        status: 409,
        message: 'Customer already exists'
      }
    }

    // Create customer
    let createCustomer = await customersService.create({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      country: req.body.country || 'in'
    })

    res.status(200).json({
      result: 'success',
      customerId: createCustomer.customerId
    })

  } catch (err) {
    next(err)
  }
}

// Get customer profile
exports.profile = async (req, res, next) => {
  try {

    let customer = await customersService.profile(req.params.customerId)
    let customerOrders = await Order.find({ customer: req.params.customerId }, 'orderId createdAt status service' ).populate('service', 'name').lean()

    res.status(200).json({
      status: 'success',
      customer: _.omit(customer, ['password']),
      orders: customerOrders
    })

  } catch (err) {
    next(err)
  }
}

// Update customer profile
exports.update = async (req, res, next) => {
  try {

    let customer = await customersService.profile(req.params.customerId)

    await Customer.updateOne({ _id: req.params.customerId }, {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        note: req.body.note
      }
    })

    res.status(200).json({
      result: 'success',
      message: 'Customer profile updated'
    })

  } catch (err) {
    next(err)
  }
}

// Delete customer
exports.delete = async (req, res, next) => {
  try {

    let customer = await customersService.profile(req.params.customerId)

    await Customer.deleteOne({ _id: req.params.customerId })
    await Order.deleteMany({ customer: req.params.customerId })

    res.status(200).json({
      result: 'success',
      message: 'Customer deleted'
    })

  } catch (err) {
    next(err)
  }
}