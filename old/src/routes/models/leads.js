const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const leads = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reqBody: { type: String },
  remarks: [{
    text: { type: String },
    remarkTime: { type: String }
  }],
  status: { type: String, default: "unread"}
})

leads.plugin(timestamp)

module.exports = mongoose.model('leads', leads)
