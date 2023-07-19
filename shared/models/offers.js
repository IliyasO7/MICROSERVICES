
import mongoose from "mongoose";

const schema = mongoose.Schema({
    offerName: String, // Special offer Name
    isPercent: { type: Boolean, default: true },
    amount: { type: Number,default:0, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service',default:null },
    limit: Number,
    used: {
        type: Number,
        default: 0,
    
    },
    validity:Date,
    isActive:{
        type:Boolean,
        default:false
    },
  //adminsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' }],
    createdBy: {  type: mongoose.Schema.Types.ObjectId, ref: 'admin'},//created by one Super Admin of just taking this call
    isDeleted:{
        type:Boolean,
        default:false
    },
    city: {type: String,default:null}, //city of admin should match with accessCode of this code
  //  approvedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'admin' } //approved my master super Admin
 },
 {
    timestamp: true,
 });

const Offers = mongoose.model("offers", schema);

export default Offers;


