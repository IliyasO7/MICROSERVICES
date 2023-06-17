const crypto = require("crypto")
const mongoose = require('mongoose')
const axios = require('axios')
const randomstring = require('randomstring')
const razorpay = require('razorpay')
const dayjs = require('dayjs')
const PhoneNumber = require('awesome-phonenumber')
const _ = require('lodash')
const COUPON_CODE = "BFREE100";

// Models
const Order = require('../../models/order')
const Service = require('../../models/service')
const Customer = require('../../models/customer')

// Services
const orderService = require('../../services/order')
const customerService = require('../../services/customers')
const smsService = require('../../services/sms')
const Vendor = require("../../models/vendor")

// List orders
exports.list = async (req, res, next) => {
  try {

    let orders = await Order.find({ customer: req.userData.customerId } ).populate('service', 'name slug').lean()
    
    res.status(200).json({
      result: 'success',
      count: orders.length,
      orders: orders
    })

  } catch (err) {
    next()
  }
}

// Order details
exports.details = async (req, res, next) => {
  try {

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('service', 'name slug category').populate('vendor', 'ownerName businessName phone').lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    // Create Payu Hash
    let payuHash = await crypto.createHash('sha512').update(`vUMBUP|${order.orderId}|${order.payment.amount}|${order.service.name} - ${order.orderId}|${order.customer.fname}|${order.customer.email}|||||||||||F8UGBZLybl3jP3BUbZOY4Sn9ZIleRPxO`).digest('hex')

    res.status(200).json({
      result: 'success',
      order: order,
      payuHash: payuHash
    })

  } catch (err) {
    next(err)
  }
}




// Verify Coupo
exports.coupon = async (req, res, next) => {
  try {
    console.log('userData:',req.userData.customerId);
    console.log('Order ID:',req.params.orderId);
    console.log('coupon',req.body.couponCode);
    console.log('************************');

    let customerData = await Customer.findOne({_id: req.userData.customerId})

    console.log('customer-Data :',customerData);
    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('service', 'name slug category').populate('vendor', 'ownerName businessName phone').lean()
    console.log("ORDER DETAILS", order);
    console.log("SERVICE :", order.service.name);

    if(customerData.couponCODEB_COUNT === 0)
    {

          if(order.service.name === "Bathroom Cleaning")
          {
            console.log('true');
            if(req.body.couponCode === COUPON_CODE)
            {

              let customerUpdate = await Customer.updateOne({_id: req.userData.customerId},
                {couponCODEB_COUNT:1})

                console.log('updated cout',customerUpdate);
                console.log('coupon MATCH SUCCESS');

                return  res.status(200).json({
                result: 'success',
                message:'100% off',
                order:order
              })
            }
            else{
              return  res.status(500).json({
                result: 'Failed',
                message:'Invalid COUPON CODE',
              
              })
            }
          }
          else{
            return  res.status(500).json({
              result: 'Operation-Failed',
              message:'Invalid COUPON SERVICE',
            })
          }
    }
    else{
      return  res.status(500).json({
        result: 'Operation-Failed',
        message:'COUPON HAS ALREADY BEEN USED',
      })

    }


  } catch (err) {
    next(err)
  }
}


// Create order
exports.create = async (req, res, next) => {
  try {

    // Get customer
    let customer = await Customer.findOne({ _id: req.userData.customerId }).lean()
    if(!customer){
      throw new Error('Customer not found')
    }

    // Service
    let service = await Service.findOne({ _id: req.body.serviceId }).lean()
    if(!service){
      throw new Error('Service not found')
    }

    let order = {
      orderId: undefined,
      isFinal: req.body.isFinal,
      service: {
        name: service.name,
        category: service.category,
        slug: service.slug,
        subLines: []
      },
      amount: {
        subtotal: 0,
        taxes: [],
        total: 0
      }
    }

    // Check if all filters are supplied
    let suppliedFilters = _.map(req.body.filters, 'filterId')
    for(var filter of service.filters){
      if(!_.includes(suppliedFilters, _.toString(filter._id))){
        throw new Error(`Filter value for "${filter.title}" is not supplied`)
      }
    }

    // Calculate subtotal prices
    order.amount.subtotal += service.price 

    // Add filters price to subtotal
    for(var o of req.body.filters){

      let filter = _.find(service.filters, (i) => { return i._id == o.filterId })
      let option = _.find(filter.options, (i) => { return i._id == o.optionId })

      order.service.subLines.push(`${filter.title}: ${option.value}`)

      order.amount.subtotal += option.price

    }

    // Calculate total price
    order.amount.total = order.amount.subtotal + _.sumBy(order.amount.taxes, 'amount')

    // If order is final
    if(req.body.isFinal){

      let orderId = _.toUpper(randomstring.generate(7))
      let now = new Date();
      now = new Date(now.getTime() + 330*60000);
      let nowStr = now.toString();
      let nowDate = nowStr.substring(0, 15);
      let nowTime = nowStr.substring(16, 24)
      await new Order({
        _id: mongoose.Types.ObjectId(),
        orderId: orderId,
        customer: req.userData.customerId,
        service: service._id,
        address: req.body.address,
        taxes: order.amount.taxes,
        'payment.amount': order.amount.total,
        serviceDate: req.body.serviceDate,
        serviceTime: req.body.serviceTime,
        filters: order.service.subLines.length > 0 ? _.join(order.service.subLines, '\n') : null,
      }).save()

      order.orderId = orderId

      
      // Send SMS
      await smsService.send({
        type: 'TXN',
        senderId: 'HSEJOY',
        templateId: '1107167223418440431',
        phone: customer.phone,
        message: `Thank you for using HouseJoy Service! Your booking ID: ${orderId} is confirmed on ${nowDate}, ${nowTime}. Our professional partner will get back to you shortly.`
      })

    }

    res.json({
      result: 'success',
      order: order
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

// Cancel Order
exports.cancel = async (req, res, next) => {
  try {

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()

    if (!order) {
      throw {
        status: 404,
        message: 'Order not found'
      }
    }

    await Order.updateOne({ orderId: req.params.orderId }, {
      $set: {
        "status": "Cancelled",
        "cancellationReason": req.body.reason
      } 
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903365507452',
      phone: order.customer.phone,
      message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
    })

    // Send SMS
    await smsService.send({
      type: 'TXN',
      senderId: 'HSEJOY',
      templateId: '1107167903561597572',
      phone: order.vendor.phone,
      message: `Housejoy: We are sorry to inform you that your upcoming service with Booking ID: ${order.orderId} got cancelled by the customer. We will let you know if there is a change in the plan! -Sarvaloka Services On Call Pvt Ltd`
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

exports.feedback = async (req, res, next) => {
  try {
    console.log(`feedback given for orderId: ${req.params.orderId}`)

    let order = await Order.findOne({ orderId: req.params.orderId, customer: req.userData.customerId }).populate('customer', 'fname lname email phone').populate('vendor', 'vendorId ownerName businessName phone').populate('service', 'name').lean()

      if (!order) {
        throw {
          status: 404,
          message: 'Order not found'
        }
      }

      await Order.updateMany({ orderId: req.params.orderId }, {
        $set: {
          "rating.service": req.body.service,
          "rating.behaviour": req.body.behaviour,
          "rating.cleaning": req.body.cleaning,
          "rating.feedback": req.body.feedback
        } 
      })

      // // Send SMS
      // await smsService.send({
      //   type: 'TXN',
      //   senderId: 'HSEJOY',
      //   templateId: '1107167903365507452',
      //   phone: order.customer.phone,
      //   message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
      // })
  
      res.status(200).json({
        result: 'success'
      })
  } catch (err) {
    console.log(err)
    next(err)
  }
}


exports.vendorFilter = async (req, res, next) => {
  try {
    console.log(`orderId is: ${req.params.orderId}`)

    let order = await Order.findOne({ orderId: req.params.orderId }).populate('customer').populate('service').lean()
      if (!order) {
        throw {
          status: 404,
          message: 'Order not found'
        }
      }
      console.log('order',order);
      console.log('order city of customer',order.customer.addresses); 
      console.log('order service name',order.service.name); 
      if(order.customer.addresses){
        var customerCity = order.customer.addresses;
      }
      console.log(customerCity);

      if(order.service.name){
        var orderServiceName = order.service.name;
      }


      const allvendors = await Vendor.find({}).lean()

      console.log('all vendors', allvendors);
      console.log('total Vendors',allvendors.length);
      
      const firstVendorFilter = [];
      var increment = 1;
      //basic Filter
      for await (eachVendor of allvendors){
        console.log('customer city is',customerCity[0].city);
        console.log('Each Vendor city is :', eachVendor.serviceArea.city);
        if(eachVendor.status == 'Active'){
          if(eachVendor.serviceArea.city === customerCity[0].city){
            if(eachVendor.serviceProvided === orderServiceName){
              if(eachVendor.availability){
                console.log('vendor availability increment is ',increment);
                ++increment;
                firstVendorFilter.push(eachVendor)
              }         
            }
          }
        }
      }
      console.log('First Filter',firstVendorFilter);
      console.log('total Vendors',allvendors.length);
      console.log('Filtered length',firstVendorFilter.length);

      //based on fullfillment Ratio
      const fullfillmentVendorFilter = firstVendorFilter.sort((a,b)=>b.fullfillment_ratio - a.fullfillment_ratio)
      console.log('sorted vendors based on Max fullfillment ratio', fullfillmentVendorFilter);

      //based on rating
      const ratingVendorFilter = fullfillmentVendorFilter.sort((a,b)=> b.rating - a.rating);
      console.log('sorted vendors based on Max Rating', ratingVendorFilter);

      //based on acceptance Ratio 
      const acceptanceVendorFilter = ratingVendorFilter.sort((a,b)=> b.acceptance_ratio - a.acceptance_ratio)
      console.log('sorted vendors based on Max Acceptance ratio', acceptanceVendorFilter);
      console.log('first sorted vendor to whom this order will be assigned ', acceptanceVendorFilter[0]);





    
      // // Send SMS
      // await smsService.send({
      //   type: 'TXN',
      //   senderId: 'HSEJOY',
      //   templateId: '1107167903365507452',
      //   phone: order.customer.phone,
      //   message: `Housejoy: Your booking ID ${order.orderId} for ${order.service.name} service has been cancelled successfully. Housejoy makes home services more accessible for you. Book again at ${process.env.HOUSEJOY_URL}. -Sarvaloka Services On Call Pvt Ltd`
      // })
      res.status(200).json({
        result: 'success'
      })
  } catch (err) {
    console.log(err)
    next(err)
  }
}