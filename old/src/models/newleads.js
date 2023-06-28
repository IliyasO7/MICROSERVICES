const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const newleads = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customerName: { type: String },
  phone: { type: Number },
  email:{ type: String },
  city:{ type: String, default: "No City Choosen"},
  inspectionDate:{ type: Date , },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },  
  remarks: [{
    text: { type: String },
    remarkTime: { type: String }
  }],
  status: { type: String, default: "unread"},
  platform:{ type: String},
})

newleads.plugin(timestamp)

module.exports = mongoose.model('newleads', newleads)
