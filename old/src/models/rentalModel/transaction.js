const mongoose = require('mongoose');
const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true}, 
    amount: Number,
    currency: {type:String, default:'INR', required:true},
    purchase_item_Title: String,
    purchase_type: String,
    transaction_id: String,
    transaction_method: String,
    transaction_signature: String,
    bookingId: String,
});
transactionSchema.plugin(timestamp)
module.exports = mongoose.model('Transaction', transactionSchema);
