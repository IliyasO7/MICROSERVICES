const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const PhoneNumber = require('awesome-phonenumber')
const randomstring = require('randomstring')

// Model
const Vendor = require('../models/vendor')

// Create vendor
exports.create = async (params) => {
  try {

    // check if vendor already exists
    let vendor = await Vendor.findOne({ phone: params.phone })
    if (vendor) {
      throw {
        status: 409,
        message: 'Vendor already exists'
      }
    }

    // Hash password
    let encryptedPassword = await bcrypt.hash(params.password, 10)

    // Generate vendorId
    let vendorId = await randomstring.generate({ length: 8, charset: 'alphanumeric', capitalization: 'uppercase' })


    // Create vendor
    var createVendor = new Vendor({
      _id: mongoose.Types.ObjectId(),
      'vendorId': vendorId,
      'ownerName': params.ownerName,
      'phone': params.phone,
      'additionalPhone': params.additionalPhone,
      'password': params.password,
      'homeAddress': params.homeAddress,
      'businessName': params.businessName,
      'officeAddress': params.officeAddress,
      'serviceProvided': params.serviceProvided,
      'teamSize': params.teamSize,
      'inBusinessSince': params.inBusinessSince,
      'languagesKnown': params.languagesKnown,
      'serviceArea': params.serviceArea,
      'aadharCardNumber': params.aadharCardNumber,
      'aadhar': params.aadhar,
      'bankAccountNumber': params.bankAccountNumber,
      'bankIfscCode': params.bankIfscCode,
      'bankDocument': params.bankDocument,
      'gst': params.gst,
      'gstDocumentUpload': params.gstDocumentUpload,
      'agreementUpload': params.agreementUpload,
      'payment': params.payment,
      'paymentReceiptNumber': params.paymentReceiptNumber,
      'paymentReceipt': params.paymentReceipt,
      'status': params.status

    })

    let create = await createVendor.save()

    if (create) {
      return {
        vendorId: create.vendorId,
        mongoId: create._id
      }
    } else {
      return false
    }
  } 
  catch (err) {
    throw err
  }
}

// Check login
exports.checkLogin = async (phone, password) => {
  try {

    let vendor = await Vendor.findOne({ phone: phone }).lean()

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    // Verify password
    let verifyPassword = await bcrypt.compare(password, vendor.password)

    if (verifyPassword) {
      return {
        result: true,
        vendorId: vendor._id
      }
    } else {
      return false
    }

  } catch (err) {
    throw err
  }
}

// Create login token
exports.createLoginToken = async (vendorId, expiresIn = '12h') => {
  try {

    let vendor = await this.profile(vendorId)

    let token = await jwt.sign({ vendorId: vendorId, role: 'vendor' }, process.env.JWT_KEY, { expiresIn: expiresIn })

    return token

  } catch (err) {
    throw err
  }
}

// Get vendor profile
exports.profile = async (vendorId) => {
  try {

    let vendor = await Vendor.findOne({ _id: vendorId }).lean()

    if (!vendor) {
      throw 'Vendor not found'
    }
  
    return vendor

  } catch (err) {
    throw err
  }
}

// Update vendor password
exports.updatePassword = async (vendorId, newPassword) => {
  try {

    let vendor = await this.profile(vendorId)

    // Hash password
    let encryptedPassword = await bcrypt.hash(newPassword, 10)

    // Update
    await Vendor.updateOne({ _id: vendorId }, {
      $set: {
        password: encryptedPassword
      }
    })

    return true

  } catch (err) {
    throw err
  }
}