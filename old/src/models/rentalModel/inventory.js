const { noConflict } = require('lodash')
const mongoose = require('mongoose')
const timestamp = require('mongoose-timestamp')

const inventorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },  
    inventoryId: { type: String, required: true },
    propertyName: { type: String, default: null, required: true },
    address: { type: String, default: null, required: true },
    floor: { type: String, default: null, required: true },
    carpetArea: { type: String, default: null, required: true },
    geolocation: { type: String, default: null, },
    mainImage: { type: String, default: null, required: true},
    entranceImage: { type: String, default: null },
    livingImage: { type: String, default: null  },
    kitchenImage: { type: String, default: null  },
    bedroomImage: { type: String, default: null },
    rent:{ type: Number, default: null, required: true },
    securityDeposit:{ type: Number, default: null, required: true },
    occupied:{ type: Boolean, default:false, required: true },
    vacant:{ type: Boolean, default:true, required: true },
    tokenAdvance:{type: Number, default: null, required: true},
    isDeleted:{ type: Boolean, default:false, required: true },
    moveInDate: { type: Date, default: null },
    moveOutDate:{ type: Date, default: null },
});
  
inventorySchema.plugin(timestamp)
  
module.exports = mongoose.model('Inventory', inventorySchema)