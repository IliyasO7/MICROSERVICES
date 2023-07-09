const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const bookingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookingId: { type: String, required: true },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true},  
    tenant : { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant',required:true}, 
    to:{type: mongoose.Schema.Types.ObjectId, ref: 'Owner',required:true},
    tokenstatus:{type: String, default:'unpaid',required:true },
    securityDepositstatus: {type: String, default:'unpaid',required:true }, 
    rentPaymentStatus:{ type: String, default:'unpaid'},
    bookingType:{type: String,default:'TOKEN' , required: true},
    paymentDate: { type: Date, default: null },
    paymentDueDate: { type: Date, default: null },
    amount:{type: Number,  default:false,required: true},
    rentPaymentDate:{ type: Date, default: null},
    paidUntil:{type: Date, default: null},
    isActive:{type:Boolean,default:false,required:true}
   /* rentPayments: [
        {
          month: {
            type: String,
          },
          payment_date: {
            type: String,
          },
          paid:{
            type:Boolean,default:false
          },
        },
      ], */
});
  
bookingSchema.plugin(timestamp)
  
module.exports = mongoose.model('BookingSchema', bookingSchema)