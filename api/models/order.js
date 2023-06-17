const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  orderId: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
  assignedAt: { type: Date, default: null },
  beforeJobImage: {  type: String, default: null },
  afterJobImage: {  type: String, default: null },
  address: {
    fname: { type: String, default: null,  },
    lname: { type: String, default: null,  },
    phone: { type: String, default: null,  },
    address: { type: String, default: null,  },
    city: { type: String, default: null,  },
    state: { type: String, default: null,  },
    pincode: { type: String, default: null,  },
    country: { type: String, default: null,  }
  },
  taxes: [
    {
      name: { type: String, default: null },
      amount: { type: Number, default: null }
    }
  ],
  payment: {
    amount: { type: Number, default: null  },
    gateway: { type: String, default: null  },
    transactionId: { type: String, default: null },
    mode: { type: String, default: null },
    status: { type: String, default: 'Unpaid' }
  },
  serviceDate: { type: Date, default: null },
  serviceTime: { type: String, default: null },
  filters: { type: String, default: null },
  note: { type: String, default: null },
  status: { type: String, default: 'Pending' },
  rejectionReason: { type: String, default: null },
  cancellationReason: { type: String, default: null },
  otp: {
    code: { type: String, default: null },
    createdAt: { type: Date, default: null }
  },
  vendor_rating: { 
    service : { type: Boolean, },
    behaviour: { type: Boolean},
    cleaning: { type: Boolean },
    timelyDelivery:{type: Boolean},
    feedback: { type: String, default: null },
   },
   customer_rating: { 
    service : { type: Number, default: null },
    behaviour: { type: Number, default: null },
    cleaning: { type: Number, default: null },
    timelyDelivery:{type: Boolean},
    feedback: { type: String, default: null },
   },
})

orderSchema.plugin(timestamp)

module.exports = mongoose.model('Order', orderSchema)