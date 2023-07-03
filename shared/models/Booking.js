
import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        bookingId: { type: String, required: true },
        inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true},  
        to : { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true}, 
        rentPaymentStatus:{ type: String, default:'unpaid'},
        bookingType:{ type: String,default:'TOKEN' , required: true},
        // tokenAmount :{ status :{ type : String,default:'unpaid'},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'transaction', required: true }},
        //  sdAmount :{ status :{ type:String,  default:'unpaid'},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'transaction', required: true }},
        tokenAmount :{ status :{ type : String,default:'unpaid'}},
        sdAmount :{ status :{ type:String,  default:'unpaid'}},
        rentAmount:{type:Number,default:null},
        paymentDay: { type: Number, default: 5 },
        contractStatus:{type:String,default:"INACTIVE",required:true}, //enums to be added
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },     
    },
    {
        timestamp: true,
    }
);

const Booking = mongoose.model("Booking", schema);

export default Booking;

