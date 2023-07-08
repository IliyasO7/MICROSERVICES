const mongoose = require('mongoose')
const dayjs = require('dayjs')
const fs = require('fs')
const _ = require('lodash')

// Models
const Service = require('../../models/service')

// Services
const bunnycdn = require('../../services/bunnycdn')

// List
exports.list = async (req, res, next) => {
  try {
    let service = await Service.find({}).lean()

    res.status(200).json({
      result: 'success',
      count: service.length,
      services: service
    })

  } catch (err) {
    next(err)
  }
}

// Get details
exports.get = async (req, res, next) => {
  try {

    // Get service
    let service = await Service.findOne({ slug: req.params.slug }).lean()
    if(!service){
      throw new Error('Service not found')
    }

    res.json({
      result: 'success',
      service
    })

  } catch (err) {
    next(err)
  }
}

// Add service
exports.create = async (req, res, next) => {
  try {

    let serviceId = mongoose.Types.ObjectId()

    await new Service({
      _id: serviceId,
      name: req.body.name,
      slug: _.kebabCase(req.body.name),
      category: req.body.category,
      icon: req.body.icon,
      banners: req.body.banners,
      commission: req.body.commission,
      servicableCities: req.body.servicableCities,
      paymentModes: req.body.paymentModes,
      includedContent: req.body.includedContent,
      excludedContent: req.body.excludedContent,
      about: req.body.about,
      price: req.body.price,
      pageUrl1: req.body.pageUrl1,
      pageUrl2: req.body.pageUrl2,
      seo: req.body.seo,
      faqs: req.body.faqs,
      filters: req.body.filters
    }).save()

    res.json({
      result: 'success',
      serviceId
    })

  } catch (err) {
    next(err)
  }   
}

// Get service
exports.service = async (req, res, next) => {
  try {
  
    let service = await Service.findById(req.params.serviceId).populate().lean()

    if (!service) {
      throw {
        status: 404,
        message: 'Service not found'
      }
    }

    res.status(200).json({
      result: 'success',
      service: service
    })

  } catch (err) {
    next(err)
  }
}

// Update media
exports.updateMedia = async (req, res, next) => {
  try {

    let service = await Service.findById(req.params.serviceId).lean()
    if(!service){
      throw new Error(`Service not found`)
    }

    let data = {
      icon: undefined,
      priceGuide: undefined,
      banners: req.files.banners ? [] : undefined
    }

    // Upload icon to CDN
    if(req.files.icon){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.icon[0].path),
        savingPath: `/services/icons/${service._id}-${req.files.icon[0].originalname}`
      })
      fs.unlinkSync(req.files.icon[0].path)
      data.icon = `${process.env.CDN_URL}/services/icons/${service._id}-${req.files.icon[0].originalname}`
    }

    // Upload priceGuide to CDN
    if(req.files.priceGuide){
      await bunnycdn.upload({
        fileData: fs.readFileSync(req.files.priceGuide[0].path),
        savingPath: `/services/priceGuides/${service._id}-${req.files.priceGuide[0].originalname}`
      })
      fs.unlinkSync(req.files.priceGuide[0].path)
      data.priceGuide = `${process.env.CDN_URL}/services/priceGuides/${service._id}-${req.files.priceGuide[0].originalname}`
    }

    // Upload banners
    if(req.files.banners){
      for(var file of req.files.banners){
        await bunnycdn.upload({
          fileData: fs.readFileSync(file.path),
          savingPath: `/services/banners/${service._id}-${file.originalname}`
        })
        fs.unlinkSync(file.path)
        data.banners.push(`${process.env.CDN_URL}/services/banners/${service._id}-${file.originalname}`)
      }
    }

    // Update in database
    await Service.updateOne({ _id: service._id }, {
      $set: data
    })

    res.json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Update service
exports.update = async (req, res, next) => {
  try {

    let service = await Service.findById(req.params.serviceId).lean()

    if (!service) {
      throw {
        status: 404,
        message: 'Service not found'
      }
    }

    // Update service 
    await Service.updateOne({ _id: req.params.serviceId }, {
      $set: {
        category: req.body.category,
        icon: req.body.icon,
        banners: req.body.banners,
        commission: req.body.commission,
        servicableCities: req.body.servicableCities,
        paymentModes: req.body.paymentModes,
        includedContent: req.body.includedContent,
        excludedContent: req.body.excludedContent,
        about: req.body.about,
        price: req.body.price,
        priceGuide: req.body.priceGuide,
        pageUrl1: req.body.pageUrl1,
        pageUrl2: req.body.pageUrl2,
        seo: req.body.seo,
        faqs: req.body.faqs,
        filters: req.body.filters
      }
    })

    res.status(200).json({
      result: 'success',
      message: 'Service Updated'
    })

  } catch (err) {
    next(err)
  }
}

// Delete service
exports.delete = async (req, res, next) => {
  try {

    let service = await Service.findById(req.params.serviceId)

    if (!service) {
      throw {
        status: 404,
        message: 'Service not found'
      }
    }

    await Service.deleteOne({ _id: req.params.serviceId })

    res.status(200).json({
      result: 'success',
      message: "service deleted successfully"
    })

  } catch (err) {
    next(err)
  }
}