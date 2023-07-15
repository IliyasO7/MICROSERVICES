import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
    isActive :{type:Boolean,default:false, required:true},
    createdBy :{type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    activatedBy :{type: mongoose.Schema.Types.ObjectId, ref: 'admin'},
    aadharCardNumber : { type: Number, default: null },
    aadhar : { type: String, default: null },
    panCardNumber : { type: String, default: null,  },
    pan : { type: String, default: null},
    isdocumentsVerified : {type:Boolean , default:false, },
    documnetsVerifiedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'admin',},
    //tenantDocument 
  },  //property aggrement for owner and tenant
  {
    timestamp: true,
  }
);

const rentalTenant = mongoose.model("rentalTenant", schema);

export default rentalTenant;
