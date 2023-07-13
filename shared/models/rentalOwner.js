import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
    isActive :{type:Boolean,default:false, required:true},
    activatedBy :{type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    createdBy :{type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    aadharCardNumber : { type: Number, default: null ,required:true},
    aadhar : { type: String, default: null },
    panCardNumber : { type: String, default: null, required: true },
    pan : { type: String, default: null},
    cancelledCheque:{ type: String, default: null  },
    isdocumentsVerified : {type:Boolean , default:false, required:true},
    documentsVerifiedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'admin',},
    //tenantDocument
  },  //property aggrement for owner and tenant
  {
    timestamp: true,
  }
);

const rentalOwner = mongoose.model("rentalOwner", schema);

export default rentalOwner;
