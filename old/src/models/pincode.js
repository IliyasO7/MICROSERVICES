
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const pincodeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  pincode: { type: String, required: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true }
})

pincodeSchema.plugin(timestamp)

module.exports = mongoose.model('Pincode', pincodeSchema)
