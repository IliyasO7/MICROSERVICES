const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const rescheduled = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },  
  newserviceDate: { type: Date, default: null },
  newserviceTime: { type: String, default: null },
  oldserviceDate: { type: Date, default: null },
  oldserviceTime: { type: String, default: null },
  addedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }, 
  addedByName:{ type: String, default: null },
})

rescheduled.plugin(timestamp)

module.exports = mongoose.model('rescheduled', rescheduled)
