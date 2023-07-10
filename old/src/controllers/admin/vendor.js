const mongoose = require('mongoose')
const dayjs = require('dayjs')
const randomstring = require('randomstring')
const _ = require('lodash')
const fs = require('fs')
const PhoneNumber = require('awesome-phonenumber')
const bcrypt = require('bcrypt')
const Service = require('../../models/service')
// Models
const Vendor = require('../../models/vendor')
const VendorServices = require('../../models/vendorServices')

// Services
const bunnycdn = require('../../services/bunnycdn')
const vendor = require('../../models/vendor')
//const vendorServices = require('../../models/vendorServices')

// List
exports.list = async (req, res, next) => {
  try {

    let filters = {
      status: req.query.status || undefined
    }

    let vendors = await Vendor.find(_.omitBy(filters, _.isNil), 'vendorId ownerName businessName typeOfVendor serviceProvided serviceArea fullfillment_ratio acceptance_ratio completedjobs missedjobs phone status createdAt ').lean()

    const vendorsList = []
    for(eachVendor of vendors){
      var vendor ={}
      vendor = eachVendor
      let vs = await VendorServices.find({vendor : eachVendor}).populate('service').lean()
      if(vs.length>0){
        let vendorServicesArray =[]
        console.log('service',vs);
        for(each of vs){
          //vendor.service = each.service.name;
          let service= {};
          service.name = each.service.name;
          service._id = each.service._id;
          vendorServicesArray.push(service)
        }  
       vendor.serviceArray = vendorServicesArray
      }
      vendorsList.push(vendor);
    }

    res.status(200).json({
      result: 'success',
      count: vendors.length,
      vendor:vendorsList
    })

  } catch (err) {
    next(err)
  }
}

// Signup
exports.create = async (req, res, next) => {
  try {
    console.log('inside create vendor',req.body.serviceProvided);
    const adminData = req.userData;
    let adminEmail = adminData.email;
    let adminId = adminData._id;
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
   let vendorData =  await new Vendor({
      _id: vendorMongooseId,
      'vendorId': vendorId,
      'ownerName': req.body.ownerName,
      'phone': phone.getNumber(),
      'additionalPhone': req.body.additionalPhone,
      'password': encryptedPassword,
      'homeAddress': req.body.homeAddress,
      'businessName': req.body.businessName,
      'officeAddress': req.body.officeAddress,
      //'serviceProvided': req.body.serviceProvided,
      'typeOfVendor':req.body.typeOfVendor,
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
      'status': req.body.status,
      'createdBy': adminEmail,
    }).save()

    for await( eachService of req.body.serviceProvided ){
      console.log('Each Service',eachService);
      let service = await Service.findById(eachService).lean()
      if(!service){
       throw 'No such service'
      }

      let vendorServicesExists = await VendorServices.findOne({vendor:vendor, service:service})

      if(vendorServicesExists){
        throw 'service already Exists'
      }

      console.log('services:',service);
      let vendorServiceMongooseId = new mongoose.Types.ObjectId()
      let vendorServices = await VendorServices.create({
        _id: vendorServiceMongooseId,
        vendor:vendorData,
        service:service
      })
   }

  // let allvendorServices = await VendorServices.find({vendor:vendor}).populate('Services').populate('Vendor');  

    console.log('after save');
    res.json({
      result: 'success',
      vendorId: vendorId,
      vendorMongooseId,
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
    let vendor = {};
    let vendors = await Vendor.findById(req.params.vendorId).populate().lean()

    vendor = vendors;

    let vs = await VendorServices.find({vendor:vendors}).populate('service')

    let vendorservices = [];
    for(each of vs){
      let service = {};
      service.name = each.service.name
      service.id = each.service.id
      vendorservices.push(service)
    }
    vendor.service = vendorservices;

    if (!vendors) {
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
    const adminData = req.userData;
    let adminEmail = adminData.email;
    let adminId = adminData._id;

    console.log('inside Update');
    let vendor = await Vendor.findById({_id:req.params.vendorId}).lean()

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
       // 'serviceProvided': req.body.serviceProvided,
        'typeOfVendor':req.body.typeOfVendor,
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
        'status': req.body.status,
        'createdBy': adminEmail,
      }
    })

    res.status(200).json({
      result: 'success',
      message: 'Vendor Updated',

    })

  } catch (err) {
    next(err)
  }
}


// Update profile
exports.RemoveVendorServices = async (req, res, next) => {
  try {
    console.log('inside Vendor Services');
    const adminData = req.userData;
    let adminEmail = adminData.email;
    let adminId = adminData._id;

    console.log('inside Update');
    let vendor = await Vendor.findById({_id:req.params.vendorId}).lean()

    if (!vendor) {
      throw {
        status: 404,
        message:  'Vendor not found'
      }
    }
    for await( eachService of req.body.serviceProvided ){
      console.log('Each Service',eachService);
      let service = await Service.findById(eachService).lean()
      console.log('service', service);
      if(!service){
       throw 'No such service'
      }

      let vendorServicesremoved = await VendorServices.updateOne(
        {vendor:vendor, service:service},
        {
          isActive:false,
        },
        {
          upsert:true,
       //   new:true,
        }
      )

      if(vendorServicesremoved){
        res.status(200).json({
          result: 'success',
          message: 'Vendor Updated',
        })
       }

 /*     console.log('services:',service);
      let vendorServiceMongooseId = new mongoose.Types.ObjectId()
      let vendorServices = await VendorServices.create({
        _id: vendorServiceMongooseId,
        vendor:vendor,
        service:service
      })  */ 
   }

 



  } catch (err) {
    next(err)
  }
}


// Add vendor Services
exports.AddVendorServices = async (req, res, next) => {
  try {
    if(!req.body.serviceProvided){
      throw {
        status: 500,
        message:  'Service Provided Parameters Required'
      }
    }
    if(!req.params.vendorId){
      throw {
        status: 500,
        message:  'VendorId Parameters Required'
      }

    }
    const adminData = req.userData;
    let adminEmail = adminData.email;
    let adminId = adminData._id;

    console.log('inside Update');
    let vendor = await Vendor.findById({_id:req.params.vendorId}).lean()

    if (!vendor) {
      throw {
        status: 500,
        message:  'Vendor not found'
      }
    }
    for await( eachService of req.body.serviceProvided ){
      console.log('Each Service',eachService);
      let service = await Service.findById(eachService).lean()
      if(!service){
        throw {
          status: 500,
          message:  'No such service'
        }
      }
      console.log('services:',service);
      let allvendorServices = await VendorServices.findOne({vendor:vendor, service:service, isActive:true});
      if(allvendorServices){
        throw {
          status: 500,
          message:  'vendor service already Exists'
        }
      }
      let vendorServiceMongooseId = new mongoose.Types.ObjectId()
      let vendorServices = await VendorServices.create({
        _id: vendorServiceMongooseId,
        vendor:vendor,
        service:service
      })  
   }
    res.status(200).json({
      result: 'success',
      message: 'Vendor Updated with Service',
    })
  } catch (err) {
    next(err)
  }
}

// Get vendor Services
exports.getVendorServices = async (req, res, next) => {
  try {

    if(!req.params.vendorId){
      throw {
        status: 500,
        message:  'VendorId Parameters Required'
      }
    }
    let vendor = await Vendor.findById(req.params.vendorId).populate().lean()
    if (!vendor) {
      throw {
        status: 404,
        message: 'Vendor not found'
      }
    }
    let allvendorServices = await VendorServices.find({vendor:vendor, isActive:true});
    res.status(200).json({
      result: 'success',
      message: "Vendor Services Fetched Successfully",
      allvendorServices: allvendorServices
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

/*

    for await( eachService of req.body.serviceProvided ){
      console.log('Each Service',eachService);
      let service = await Service.findById(eachService).lean()
      if(!service){
       throw 'No such service'
      }

      let vendorServicesExists = await VendorServices.deleteOne({vendor:vendor, service:service})

    

      console.log('services:',service);
      let vendorServiceMongooseId = new mongoose.Types.ObjectId()
      let vendorServices = await VendorServices.create({
        _id: vendorServiceMongooseId,
        vendor:vendor,
        service:service
      })
   }

   */