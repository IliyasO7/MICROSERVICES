const _ = require('lodash')
const moment = require('moment')

// Models
const Order = require('../../models/order')
const Vendor = require('../../models/vendor')
const Rescheduled = require('../../models/rescheduled')
const Notes =require('../../models/notes')
const Admin =require('../../models/admin')
// Services
const firebaseService = require('../../services/firebase')
const smsService = require('../../services/sms')

// List all orders
exports.list = async (req, res, next) => {
  try {

    // Fetch all orders
    
    let orders = await Order.find({}, 'orderId createdAt orderNo status payment.amount payment.status payment.mode taxes').select('serviceDate').select('serviceTime').populate('service', 'name paymentModes price').populate('customer', 'fname lname addresses').lean()

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

    let notes =  await Notes.find(
      {
        order : order,
      })

    let rescheduleJob =  await Rescheduled.find(
      {
        order:order,
      })



    if (!order) {
      throw {
        status: 404,
        message: 'Order not found',

      }
    }

    res.status(200).json({
      result: 'success',
      order: order,
      rescheduleJob,
      notes
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


// Update Pause status
exports.updatePause = async (req, res, next) => {
  try {
    console.log('OrderId', req.params.orderId);
    console.log('Paused', req.body.paused);
    await Order.updateOne({ orderId: req.params.orderId }, {
        paused: req.body.paused
    })
    res.status(200).json({
      result: 'success'
    })
  } catch (err) {
    next(err)
  }
}

// create order Note
exports.createNote = async (req, res, next) => {
  try {
    console.log('Create A Note');
    let admin = await Admin.findOne({ _id: req.userData }).lean()
    console.log('Admin Data :',admin);

   let orderDetails = await Order.findOne({orderId:req.params.orderId})
   console.log('Order Details', orderDetails);

   let notes =  await Notes.create(
      {
        order : orderDetails,
        addedBy: admin,
        addedByEmail:admin.email,
        note: req.body.note,
        time:req.body.noteTime,
      })


    res.status(200).json({
      result: 'success',
      notes,


    })

  } catch (err) {
    next(err)
  }
}


//get order Note
exports.getNotes = async (req, res, next) => {
  try {
    console.log('Get Notes');
    let admin = await Admin.findOne({ _id: req.userData }).lean()
   
   let orderDetails = await Order.findOne({orderId:req.params.orderId})
   console.log('Order Details', orderDetails);

   let notes =  await Notes.find(
      {
        order : orderDetails,
      })

    res.status(200).json({
      result: 'success',
      notes
    })

  } catch (err) {
    next(err)
  }
}


exports.rescheduleJob = async (req, res, next) => {
  try {

    let admin = await Admin.findOne({ _id: req.userData }).lean()
    console.log('Admin Data',admin);

    let OldOrder = await Order.findOne({orderId: req.params.orderId})
    let sd = OldOrder.serviceDate;
    let st = OldOrder.serviceTime;

      await Order.updateOne(
      { orderId: req.params.orderId },
      {
        serviceDate: req.body.serviceDate,
        serviceTime: req.body.serviceTime,
        isRescheduled: true,
      })

   let rescheduleJob =  await Rescheduled.create(
      {
        order:OldOrder,
        newserviceDate: req.body.serviceDate,
        newserviceTime: req.body.serviceTime,
        oldserviceDate: sd,
        oldserviceTime: st,
        addedBy: admin, 
        addedByName: admin.email,
      })
      
    res.status(200).json({
      result: 'success',
      rescheduleJob,
    })

  } catch (err) {
    next(err)
  }
}

// Get Rescheduled Jobs
exports.getRescheduleJob = async (req, res, next) => {
  try {

    let admin = await Admin.findOne({ _id: req.userData }).lean();
    let orderDetails = await Order.find({orderId: req.params.orderId})

    let rescheduleJob =  await Rescheduled.find(
      {
        order:orderDetails,
        addedByName: admin.email,
      })
      
   
    res.status(200).json({
      result: 'success',
      rescheduleJob,
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