const mongoose = require('mongoose')
const razorpay = require('razorpay')
const axios = require('axios')
const _ = require('lodash')

// Models
const Order = require('../models/order')
const Service = require('../models/service')
const Pincode = require('../models/pincode')
const Customer = require('../models/customer')


// Services
const customersService = require('../services/customers')

// Get pincode details
exports.getPincodeDetails = async (pincode) => {
  try {

    let pincodeData = await Pincode.findOne({ pincode: pincode }).lean()

    if (!pincodeData) {
      
      let pincodeApi = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
      if (!pincodeApi.data[0].PostOffice) {
        throw `Invalid pincode "${pincode}"`
      }

      pincodeApi = pincodeApi.data[0].PostOffice[0]

      let payload = {
        _id: mongoose.Types.ObjectId(),
        pincode: pincodeApi.Pincode,
        name: pincodeApi.Name,
        district: pincodeApi.District,
        region: pincodeApi.Region,
        state: pincodeApi.State,
        country: pincodeApi.Country
      }

      await new Pincode(payload).save()

      return payload

    }

    return pincodeData

  } catch (err) {
    console.log(err)
    throw err
  }
}

// Generate order data
exports.generateOrderData = async (params) => {
  try {

    // Params: ['customerId', 'serviceId']

    let service = await Service.findOne({ _id: params.serviceId }).lean()
    if(!service){
      throw new Error('Service not found')
    }

    let customer = await Customer.findOne({ _id: params.customerId }).lean()
    if(!customer){
      throw new Error('Customer not found')
    }

    // Order data
    await new Order({
      _id: mongoose.Types.ObjectId(),
      customer: customer._id,
      service: service._id,
      address: {
        shipping: null,
        billing: null
      },
      amount: service.amount
    }).save()   

  } catch (err) {
    throw err
  }
}