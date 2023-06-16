const mongoose = require('mongoose')
const dayjs = require('dayjs')
const randomstring = require('randomstring')
const _ = require('lodash')
const fs = require('fs')
const PhoneNumber = require('awesome-phonenumber')
const bcrypt = require('bcrypt')

// Models
const Vendor = require('../../models/vendor')

// Services
const bunnycdn = require('../../services/bunnycdn')

// List
exports.list = async (req, res, next) => {
  try {

    let filters = {
      status: req.query.status || undefined
    }

    let vendors = await Vendor.find(_.omitBy(filters, _.isNil), 'vendorId ownerName businessName serviceProvided status createdAt').lean()

    res.status(200).json({
      result: 'success',
      count: vendors.length,
      vendors: vendors,
    })

  } catch (err) {
    next(err)
  }
}

// Signup
exports.create = async (req, res, next) => {
  try {

    // Format phone number
    let phone = new PhoneNumber(req.body.phone, 'IN')
    if (!phone.isValid()) {
      throw 'Invalid phone number'
    }

    // Check if vendor is already registered
    let vendor = await Vendor.findOne({ phone: phone.getNumber() })
    if (vendor) {
      throw new Error('Vendor already exists')
    }

    // Hash password
    let encryptedPassword = await bcrypt.hash(req.body.password, 10)

    // Generate vendorId
    let vendorId = await randomstring.generate({ length: 8, charset: 'alphanumeric', capitalization: 'uppercase' })

    let vendorMongooseId = mongoose.Types.ObjectId()

    // Create new vendor
    await new Vendor({
      _id: vendorMongooseId,
      'vendorId': vendorId,
      'ownerName': req.body.ownerName,
      'phone': phone.getNumber(),
      'additionalPhone': req.body.additionalPhone,
      'password': encryptedPassword,
      'homeAddress': req.body.homeAddress,
      'businessName': req.body.businessName,
      'officeAddress': req.body.officeAddress,
      'serviceProvided': req.body.serviceProvided,
      'teamSize': req.body.teamSize,
      'inBusinessSince': req.body.inBusinessSince,
      'languagesKnown': req.body.languagesKnown,
      'serviceArea': req.body.serviceArea,
      'aadharCardNumber': req.body.aadharCardNumber,
      'aadhar': req.body.aadhar,
      'bankAccountNumber': req.body.bankAccountNumber,
      'bankIfscCode': req.body.bankIfscCode,
      'bankDocument': req.body.bankDocument,
      'gst': req.body.gst,
      'gstDocumentUpload': req.body.gstDocumentUpload,
      'agreementUpload': req.body.agreementUpload,
      'payment': req.body.payment,
      'paymentReceiptNumber': req.body.paymentReceiptNumber,
      'paymentReceipt': req.body.paymentReceipt,
      'status': req.body.status
    }).save()

    res.json({
      result: 'success',
      vendorId: vendorId,
      vendorMongooseId
    })

  } catch (err) {
    next(err)
  }
}

// Update media
exports.updateMedia = async (req, res, next) => {
  try {

    let vendor = await Vendor.findById(req.params.vendorId).lean()
    if(!vendor){
      throw new Error(`Vendor not found`)
    }

    let data = {
      aadhar: undefined,
      bankDocument: undefined,
      gstDocumentUpload: undefined,
      agreementUpload: undefined,
      paymentReceipt: undefined
    }

    // Upload Aadhar to CDN
    if(req.files.aadhar){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.aadhar[0].path),
        savingPath: `/vendors/aadhars/${vendor._id}-${req.files.aadhar[0].originalname}`
      })
      fs.unlinkSync(req.files.aadhar[0].path)
      data.aadhar = `${process.env.CDN_URL}/vendors/aadhars/${vendor._id}-${req.files.aadhar[0].originalname}`
    }

    // Upload bankDocument to CDN
    if(req.files.bankDocument){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.bankDocument[0].path),
        savingPath: `/vendors/bankDocuments/${vendor._id}-${req.files.bankDocument[0].originalname}`
      })
      fs.unlinkSync(req.files.bankDocument[0].path)
      data.bankDocument = `${process.env.CDN_URL}/vendors/bankDocuments/${vendor._id}-${req.files.bankDocument[0].originalname}`
    }

    // Upload gstDocumentUpload to CDN
    if(req.files.gstDocumentUpload){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.gstDocumentUpload[0].path),
        savingPath: `/vendors/gstDocumentUpload/${vendor._id}-${req.files.gstDocumentUpload[0].originalname}`
      })
      fs.unlinkSync(req.files.gstDocumentUpload[0].path)
      data.gstDocumentUpload = `${process.env.CDN_URL}/vendors/gstDocumentUpload/${vendor._id}-${req.files.gstDocumentUpload[0].originalname}`
    }

    // Upload agreementUpload to CDN
    if(req.files.agreementUpload){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.agreementUpload[0].path),
        savingPath: `/vendors/agreementUpload/${vendor._id}-${req.files.agreementUpload[0].originalname}`
      })
      fs.unlinkSync(req.files.agreementUpload[0].path)
      data.agreementUpload = `${process.env.CDN_URL}/vendors/agreementUpload/${vendor._id}-${req.files.agreementUpload[0].originalname}`
    }

    // Upload paymentReceipt to CDN
    if(req.files.paymentReceipt){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.paymentReceipt[0].path),
        savingPath: `/vendors/paymentReceipt/${vendor._id}-${req.files.paymentReceipt[0].originalname}`
      })
      fs.unlinkSync(req.files.paymentReceipt[0].path)
      data.paymentReceipt = `${process.env.CDN_URL}/vendors/paymentReceipt/${vendor._id}-${req.files.paymentReceipt[0].originalname}`
    }


    // Update in database
    await Vendor.updateOne({ _id: vendor._id }, {
      $set: data
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Get profile
exports.profile = async (req, res, next) => {
  try {
  
    let vendor = await Vendor.findById(req.params.vendorId).populate().lean()

    if (!vendor) {
      throw {
        status: 404,
        message: 'Vendor not found'
      }
    }

    res.status(200).json({
      result: 'success',
      vendor: _.omit(vendor, ['password'])
    })

  } catch (err) {
    next(err)
  }
}

// Update profile
exports.update = async (req, res, next) => {
  try {

    let vendor = await Vendor.findById(req.params.vendorId).lean()

    if (!vendor) {
      throw {
        status: 404,
        message:  'Vendor not found'
      }
    }

    // Update vendor profile
    await Vendor.updateOne({ _id: req.params.vendorId }, {
      $set: {
        'ownerName': req.body.ownerName,
        'phone': req.body.phone,
        'additionalPhone': req.body.additionalPhone,
        'homeAddress': req.body.homeAddress,
        'businessName': req.body.businessName,
        'officeAddress': req.body.officeAddress,
        'serviceProvided': req.body.serviceProvided,
        'teamSize': req.body.teamSize,
        'inBusinessSince': req.body.inBusinessSince,
        'languagesKnown': req.body.languagesKnown,
        'serviceArea': req.body.serviceArea,
        'aadharCardNumber': req.body.aadharCardNumber,
        'aadhar': req.body.aadhar,
        'bankAccountNumber': req.body.bankAccountNumber,
        'bankIfscCode': req.body.bankIfscCode,
        'bankDocument': req.body.bankDocument,
        'gst': req.body.gst,
        'gstDocumentUpload': req.body.gstDocumentUpload,
        'agreementUpload': req.body.agreementUpload,
        'payment': req.body.payment,
        'paymentReceiptNumber': req.body.paymentReceiptNumber,
        'paymentReceipt': req.body.paymentReceipt,
        'status': req.body.status
      }
    })

    res.status(200).json({
      result: 'success',
      message: 'Vendor Updated'
    })

  } catch (err) {
    next(err)
  }
}

// Delete vendor
exports.delete = async (req, res, next) => {
  try {

    let vendor = await Vendor.findById(req.params.vendorId).populate().lean()

    if (!vendor) {
      throw {
        status: 404,
        message: 'Vendor not found'
      }
    }

    await Vendor.deleteOne({ _id: req.params.vendorId })

    res.status(200).json({
      result: 'success',
      message: "Vendor deleted successfully"
    })

  } catch (err) {
    next(err)
  }
}