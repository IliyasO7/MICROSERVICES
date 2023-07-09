const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const categorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true}

})

categorySchema.plugin(timestamp)

module.exports = mongoose.model('Category', categorySchema)