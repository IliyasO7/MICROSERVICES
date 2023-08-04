const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const ownerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ownerId: { type: String, required: true },
    ownerName: { type: String, default: null, required: true },
    phone: { type: String, default: null, required: true },
    email: { type: String, default: null, required: true },
    aadharCardNumber: { type: String, default: null, required: true },
    aadharDocument: { type: String, default: null, },
    panCardNumber: { type: String, default: null, required: true },
    panCardDocument: { type: String, default: null, },
    bankAccountNumber: { type: String, default: null, required: true },
    bankName: { type: String, default: null, required: true },
    bankIfscCode: { type: String, default: null, required: true },
    bankDocument: { type: String, default: null },
    cancelledCheque: { type: String, default: null },
})
  
ownerSchema.plugin(timestamp)
  
module.exports = mongoose.model('Owner', ownerSchema)