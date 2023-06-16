const _ = require('lodash')
const moment = require('moment')

// Models
const Order = require('../../models/order')
const Vendor = require('../../models/vendor')

// Services
const firebaseService = require('../../services/firebase')
const smsService = require('../../services/sms')

// List all orders
exports.list = async (req, res, next) => {
  try {

    // Fetch all orders
    
    let orders = await Order.find({}, 'orderId createdAt status payment.amount payment.status payment.mode taxes').select('serviceDate').select('serviceTime').populate('service', 'name paymentModes price').populate('customer', 'fname lname addresses').lean()

    res.status(200).json({
      result: 'success',
      count: orders.length,
      orders: orders,

    })

  } catch (err) {
    next(err)
  }
}

// Get order details
exports.details = async (req, res, next) => {
  try {

    // Fetch order
    let order = await Order.findOne({ orderId: req.params.orderId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    res.status(200).json({
      result: 'success',
      order: order
    })

  } catch (err) {
    next(err)
  }
}

// Update order status
exports.updateStatus = async (req, res, next) => {
  try {

    await Order.updateOne({ orderId: req.params.orderId }, {
      $set: {
        status: req.body.status
      }
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Update order Note
exports.updateNote = async (req, res, next) => {
  try {

    await Order.updateOne({ orderId: req.params.orderId }, {
      $set: {
        note: req.body.note
      }
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Assign vendor
exports.assignVendor = async(req, res, next) => {
  try {

    // Get order
    let order = await Order.findOne({ orderId: req.params.orderId }).lean()
    if(!order){
      throw new Error('Order not found')
    }

    // Get vendor
    let vendor = await Vendor.findOne({ _id: req.body.vendorId }).lean()
    if(!vendor){
      throw new Error('Vendor not found')
    }

    // Assign vendor
    await Order.updateOne({ orderId: req.params.orderId }, {
      $set: {
        vendor: req.body.vendorId,
        assignedAt: moment().toDate()
      }
    })


    // Send notification to vendor
    await firebaseService.sendNotification({
      registrationToken: vendor.fcmToken,
      title: 'New Order Assigned',
      body: `New order with Order-ID ${order.orderId} has been assigned to you.`
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903318015766',
      phone: vendor.phone,
      message: `Hi  ${vendor.ownerName}, a new booking request is up. Kindly check the app to confirm it. -Sarvaloka Services On Call Pvt Ltd`
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}
 
// Delete order
exports.delete = async (req, res, next) => {
  try {

    await Order.deleteOne({ orderId: req.params.orderId })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}