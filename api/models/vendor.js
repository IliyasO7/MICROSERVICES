const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const vendorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    vendorId: { type: String, required: true },
    ownerName: { type: String, default: null, required: true },
    phone: { type: String, default: null, required: true },
    additionalPhone: { type: String, default: null, required: true},
    password: { type: String, default: null, required: true },
    homeAddress: { type: String, default: null, required: true },
    businessName: { type: String, default: null , required: true },
    officeAddress: { type: String, default: null },
    serviceProvided: { type : String, default : null, required: true },
    teamSize: { type: Number, default: null, required: true },
    inBusinessSince: { type : String, default: null, required: true },
    languagesKnown: [
      { type : String, default: null, required: true }
    ], 
    serviceArea: {
      city: { type: String, default: null, required: true },
      hubs: [
        {
          region: { type: String, default: null, required: true },
          pincode: { type: Number, default: null, required: true },
          name: { type: String, default: null, required: true }
        }
      ]
    },
    aadharCardNumber: { type: String, default: null, required: true },
    aadhar: { type: String, default: null, },
    bankAccountNumber: { type: String, default: null, required: true },
    bankIfscCode: { type: String, default: null, required: true },
    bankDocument: { type: String, default: null },
    gst: { type: String, default: null},
    gstDocumentUpload: { type : String, default: null },
    agreementUpload: { type: String, default: null },
    payment: { type: Number, default: 2000},
    paymentReceiptNumber: { type: String, default: null, required: true },
    paymentReceipt: { type: String, default: null },
    fcmToken: { type: String, default: null },
    status: { type: String, default: 'Active'}
})
  
vendorSchema.plugin(timestamp)
  
module.exports = mongoose.model('Vendor', vendorSchema)