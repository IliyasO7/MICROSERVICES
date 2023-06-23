const mongoose = require('mongoose')
const dayjs = require('dayjs')
const fs = require('fs')
const _ = require('lodash')
const { phone } = require('phone')
const randomstring = require('randomstring')
const Bucket = require('../../models/bucket')
// Models
const Order = require('../../models/order')
const Vendor = require('../../models/vendor')

// Services
const bunnycdn = require('../../services/bunnycdn')
const smsService = require('../../services/sms')

// Update order status
exports.updateStatus = async (req, res, next) => {
  try {

    // Get order
    let order = await Order.findOne({ _id: req.params.orderId, vendor: req.userData.vendorId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()
    if(!order){
        throw new Error('Order not found')
    }

    switch (req.body.status) {

        case 'accept':
            await Order.updateOne({ _id: req.params.orderId }, {
                $set: {
                    status: 'Assigned'
                }
            })

            // Send SMS
            await smsService.send({
              type: 'TXN',
              senderId: 'HSEJOY',
              templateId: '1107167903398363444',
              phone: order.customer.phone,
              message: `HouseJoy: We have assigned ${order.vendor.ownerName} for your ${order.service.name} with booking ID:${order.orderId}.
              Contact No: ${order.vendor.phone}. Scheduled service: ${order.serviceDate} The price will be quoted upon inspection by our professional partner. Kindly pay the Inspection Charge if you choose not to avail of the service after the visit. Book again at ${process.env.HOUSEJOY_URL}.`
            })
            break

        case 'reject':
            await Order.updateOne({ _id: req.params.orderId }, {
                $set: {
                    vendor: null,
                    status: 'Pending',
                    rejectionReason: req.body.rejectionReason
                }
            })

            // // Send SMS
            // await smsService.send({
            //   type: 'TXN',
            //   senderId: 'HSEJOY',
            //   templateId: '1107167903419361113',
            //   phone: order.customer.phone,
            //   message: `Housejoy: We regret to inform you that your ${order.service.name} with booking ID:${order.orderId} has been cancelled due to the unavailability of professional partners. We apologize for the inconvenience.  Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
            // })
            break

        case 'start':
            await Order.updateOne({ _id: req.params.orderId }, {
                $set: {
                    status: 'Started'
                }
            })

            // Send SMS
            await smsService.send({
              type: 'TXN',
              senderId: 'HSEJOY',
              templateId: '1107167903334830945',
              phone: order.customer.phone,
              message: `Housejoy: ${order.vendor.ownerName} Phone no ${order.vendor.phone} has started the ${order.service.name} with booking ID: ${order.orderId}. You can pay online on the app or website under My Orders.${process.env.HOUSEJOY_URL} -Sarvaloka Services On Call Pvt Ltd`
            })
            break

        case 'cancel':
            await Order.updateOne({ _id: req.params.orderId }, {
                $set: {
                    status: 'Cancelled',
                    cancellationReason: req.body.cancellationReason
                }
            })

            // Send SMS
            await smsService.send({
              type: 'TXN',
              senderId: 'HSEJOY',
              templateId: '1107167223463634714',
              phone: order.customer.phone,
              message: `Hi${order.customer.fname}, the service requested by ${order.vendor.ownerName} got cancelled due to a change of plans. -Sarvaloka Services On Call Pvt Ltd`
            })
            break

        default:
            break

    }

    res.json({
        result: 'success'
    })
    


  } catch (err) {
    next(err)
  }
}

//Add Before Job Image
exports.beforeJobImage = async (req, res, next) => {
  try {

    let order = await Order.findById(req.params.orderId).lean()
    if(!order){
      throw new Error(`Order not found`)
    }

    let data = {
      beforeJobImage: undefined, 
    }

    // Upload beforeJobImage to CDN
    if(req.files.beforeJobImage){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.beforeJobImage[0].path),
        savingPath: `/orders/beforeJobImage/${order._id}-${req.files.beforeJobImage[0].originalname}`
      })
      fs.unlinkSync(req.files.beforeJobImage[0].path)
      data.beforeJobImage = `${process.env.CDN_URL}/orders/beforeJobImage/${order._id}-${req.files.beforeJobImage[0].originalname}`
    }

    // Update in database
    await Order.updateOne({ _id: order._id }, {
      $set: data
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

//Add After Job Image
exports.afterJobImage = async (req, res, next) => {
  try {

    let order = await Order.findById(req.params.orderId).lean()
    if(!order){
      throw new Error(`Order not found`)
    }

    let data = {
      afterJobImage: undefined, 
    }

    // Upload afterJobImage to CDN
    if(req.files.afterJobImage){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.afterJobImage[0].path),
        savingPath: `/orders/afterJobImage/${order._id}-${req.files.afterJobImage[0].originalname}`
      })
      fs.unlinkSync(req.files.afterJobImage[0].path)
      data.afterJobImage = `${process.env.CDN_URL}/orders/afterJobImage/${order._id}-${req.files.afterJobImage[0].originalname}`
    }

    // Update in database
    await Order.updateOne({ _id: order._id }, {
      $set: data
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// List orders
exports.list = async (req, res, next) => {
    try {

      let filters = {
        vendor: req.userData.vendorId,
        status: req.query.status || undefined
      }
  
      let orders = await Order.find(_.omitBy(filters, _.isNil), 'orderId customer service payment createdAt status serviceDate serviceTime assignedAt').populate('customer', '_id fname lname email phone').populate('service', 'name category').lean()
      
      res.status(200).json({
        result: 'success',
        count: orders.length,
        orders: orders
      })
  
    } catch (err) {
      next()
    }
  }


  // List orders
exports.bucketlist = async (req, res, next) => {
  try {
    const vendor = await Vendor.find({vendorId:req.userData.vendorId})
   // let orders = await Order.find(_.omitBy(filters, _.isNil), 'orderId customer service payment createdAt status serviceDate serviceTime assignedAt').populate('customer', '_id fname lname email phone').populate('service', 'name category').lean()
    let bucketList = await Bucket.find({vendor :vendor._id,assigned:true,vendorJobStatus:'PENDING',bucketStatus:'OPEN'})
    res.status(200).json({
      result: 'success',
      count: bucketList.length,
      bucket: bucketList
    })
  } catch (err) {
    next()
  }
}

  // List orders
  exports.getBucketWithOrderId = async (req, res, next) => {
    try {
      const vendor = await Vendor.find({vendorId:req.userData.vendorId})
     // let orders = await Order.find(_.omitBy(filters, _.isNil), 'orderId customer service payment createdAt status serviceDate serviceTime assignedAt').populate('customer', '_id fname lname email phone').populate('service', 'name category').lean()
      let bucketOrder = await Bucket.find({vendor :vendor._id,order:req.params.orderId})
      res.status(200).json({
        result: 'success',
        bucket: bucketOrder
      })
    } catch (err) {
      next()
    }
  }

exports.updateJobStatus = async (req, res, next) => {
  try {
   console.log(req.body.status);
   if(!req.body.status){
    res.status(400).json({
      result: 'Something Went Wrong',
    })
  }
   
    const vendor = await Vendor.findOne({vendorId:req.userData.vendorId})
    if(req.body.status === 'ACCEPTED'){
      var status = 'ACCEPTED'
    }else if(req.body.status === 'REJECTED'){
       status = 'REJECTED'
    }
   // let orders = await Order.find(_.omitBy(filters, _.isNil), 'orderId customer service payment createdAt status serviceDate serviceTime assignedAt').populate('customer', '_id fname lname email phone').populate('service', 'name category').lean()
    let updatebucketList = await Bucket.updateOne({vendor :vendor._id,assigned:true,order:req.params.orderId},{ vendorJobStatus:req.body.status,bucketStatus:'CLOSED'})
    if(!updatebucketList){
      res.status(500).json({
        result: 'ORDER HAS BEEN CANCELLED',
      })
    }else{
      res.status(200).json({
        result: 'Checking for availability,Your Profile would be updated Shortly in your orders',
        data:updatebucketList
      })
    }
  } catch (err) {
    next()
  }
}
  
  // Order details
  exports.details = async (req, res, next) => {
    try {
  
      let order = await Order.findOne({ _id: req.params.orderId, vendor: req.userData.vendorId }).populate('customer', 'fname lname phone email').populate('service', 'name slug category').lean()

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

// Update order Price
exports.updatePrice = async (req, res, next) => {
  try {

    let order = await Order.findOne({ _id: req.params.orderId, vendor: req.userData.vendorId }).lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    // Update price
    await Order.updateOne({ _id: req.params.orderId}, {
      $set: {
        payment: req.body.payment
      }
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Send Job completion OTP
exports.sendJobCompletionOtp = async (req, res, next) => {
  try {

    let order = await Order.findOne({ _id: req.params.orderId, vendor: req.userData.vendorId }).populate('customer', 'fname lname phone email').lean()
    if(!order){
      throw new Error(`Order not found`)
    }

    // Format phone number
    let phoneNumber = (await phone(order.customer.phone, { country: 'IN' })).phoneNumber

    // Generate OTP Code
    let otp = await randomstring.generate({ length: 4, charset: 'numeric' })


    // Send OTP
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167674560761949',
      phone: phoneNumber,
      message: `Dear ${order.customer.fname},
      Our expert has attempted to complete the job. Please share OTP ${otp} if the job is completed. Reach out to ${process.env.HELPLINE_NUMBER} if the attempt is wrong. Happy Service -Sarvaloka Services On Call Pvt Ltd`
    })

    // Update in database
    await Order.updateOne({ _id: order._id }, {
      $set: {
        otp: {
          code: otp,
          createdAt: new Date()
        }
      }
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Verify login OTP
exports.verifyJobCompletionOtp = async (req, res, next) => {
  try {

    let order = await Order.findOne({ _id: req.params.orderId, vendor: req.userData.vendorId }).populate('customer', 'fname lname phone email').populate('service', 'name').lean()
    if(!order){
      throw new Error(`Order not found`)
    }

    // Verify OTP
    if(req.body.otp != order.otp.code){
      throw new Error('Invalid otp code')
    }

    // Update Order status
    await Order.updateOne({ _id: order._id }, {
      $set: {
        status: 'Completed'
      }
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167223440341189',
      phone: order.customer.phone,
      message: `Housejoy: Our professional partner confirms that your service has been completed. We are glad that you used our service!${order.service.name} -Sarvaloka Services On Call Pvt Ltd`
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}