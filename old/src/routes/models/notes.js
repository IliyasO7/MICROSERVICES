const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const notes = mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },  
  note:{type:String,default:null},
  time: {type: String,default:null },
  addedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' },  
  addedByEmail: {type: String, default:null,}
})

notes.plugin(timestamp)

module.exports = mongoose.model('Notes', notes)
