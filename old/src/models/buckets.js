const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');
const buckets = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  bucketId:{type:String,required:true},
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor'},
  order:   { type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
  assigned :{type:Boolean, default:false},
  vendorJobStatus:{type:String, default:'PENDING',required:true},
  bucketStatus:{type:String, default:'OPEN',required:true}
})
buckets.plugin(timestamp)
module.exports = mongoose.model('Bucket', buckets)
