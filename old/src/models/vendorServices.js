const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const vendorServices = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null,required:true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service',default:null, required: true },
    isActive: { type: Boolean, default: true }
})
  
vendorServices.plugin(timestamp)

module.exports = mongoose.model('vendorService', vendorServices)