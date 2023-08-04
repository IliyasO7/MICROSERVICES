const mongoose = require('mongoose')
const dayjs = require('dayjs')
const _ = require('lodash')
const Order = require('../../models/order')
// Models
const Vendor = require('../../models/vendor')

// Services
const vendorService = require('../../services/vendor')
const firebaseService = require('../../services/firebase')

// Login
exports.login = async (req, res, next) => {
  try {

    // Check login
    let verifyLogin = await vendorService.checkLogin(req.body.phone, req.body.password)

    if (!verifyLogin) {
      throw {
        status: 401,
        message: 'Invalid credentials'
      }
    }

    // Save FCM token
    let fcm =  await Vendor.updateOne({ _id: verifyLogin.vendorId }, {
        $set: {
          "fcmToken": req.body.fcmToken || null
        }
      })

    // Generate login token
    let loginToken = await vendorService.createLoginToken({ _id: verifyLogin.vendorId })

    res.status(200).json({
      result: 'success',
      token: loginToken
    })    
  } catch (err) {
    next(err)
  }
}

// Get profile
exports.profile = async (req, res, next) => {
  try {
  
    let profile = await Vendor.findById(req.userData.vendorId).populate().lean()

    if (!profile) {
      throw {
        status: 404,
        message: 'Vendor not found'
      }
    }

    res.status(200).json({
      result: 'success',
      profile: _.omit(profile, ['password', 'aadharCardNumber', 'aadhar', 'bankDocument', 'gstDocumentUpload', 'agreementUpload', 'paymentReceiptNumber', 'paymentReceipt', 'payment'])
    })

  } catch (err) {
    next(err)
  }
}

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {

    let vendor = await vendorsService.profile(req.userData.vendorId)

    // Check if any existing profile exists with given phone 
    if (vendor.phone != req.body.phone) {
      let exist = await Vendor.findOne({ phone: req.body.phone })
      if (exist) {
        throw {
          status: 409,
          message: 'phone already in use'
        }
      }
    }

    // Update vendor profile
    await Vendor.updateOne({ _id: req.params.vendorId }, {
      $set: {
        
        // personal details

        'username': req.userData.username,
        'fName': req.body.fName,
        'lName': req.body.lName,
        'phone': req.body.phone,
        'additionalMobileNumber': req.body.additionalMobileNumber,
        'password': req.body.paassword,
        'addresses': req.body.addresses,
        'country': req.body.country,
        'status': req.body.status,

        // Buisness details

        'businessName': req.body.Business ,
        'officeAddress': req.body.officeAddress,
        'serviceProvided': req.body.serviceProvided,
        'teamSize': req.body.teamSize,
        'inBusinessSince': req.body.inBusinessSince,
        'languagesKnown': req.body.languageKnown,
        'serviceArea': req.body.serviceArea,
        'hub': req.body.hub,

        // documents

        'aadharCardNumber': req.body.aadharCardNumber,
        // 'aadhar': req.body.aadhar,
        'bankAccountNumber': req.body.bankAccountNumber,
        'ifsc': req.body.ifsc,
        // 'bankDocument': req.body.bankDocument,
        'gst': req.body.gst,
        // 'gstDocumentUpload': req.body.gstDocumentUpload,
        // 'agreementUpload': req.body.agreementUpload,

        // payment verification

        // 'paymentReciept': req.body.paymentReciept

      }
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Update password
exports.updatePassword = async (req, res, next) => {
  try {

    let updatePassword = await vendorService.updatePassword(req.userData.vendorId, req.body.password)

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Update service Provided Includes
exports.serviceCheckIncludes = async (req, res, next) => {
  try {
    console.log('req body order',req.params.orderId);
    console.log('req body vendorId', req.body.vendorId);

    const order = await Order.findOne({orderId:req.params.orderId});
    if(order){
      console.log('order Details',order);
      console.log('order service data',order.service);
      console.log('order service data is',order.service.ObjectId);
    }

    const vendor = await Vendor.findOne({ _id : req.body.vendorId })
    console.log('vendor',vendor);
    console.log('vendor service',vendor.serviceProvided);
    if(vendor){
      if(vendor.serviceProvided.includes(order.service)){
        console.log('yes');
      }
      console.log('here inside vendor');

    }


    //let updatePassword = await vendorService.updatePassword(req.userData.vendorId, req.body.password)

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}