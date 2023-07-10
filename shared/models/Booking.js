
import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        bookingId: { type: String, required: true},
        inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true},  
        to : { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true}, 
        currentBookingType:{ type: String,default:'TOKEN' , required: true},
        tokenAmount :{ status :{ type : String,default:'unpaid'},amount : { type : Number,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions' }},
        securityDeposit :{ status :{ type:String,  default:'unpaid'},amount : { type : Number,default:null},paymentDue: { type: Date,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions'}},
       // tokenAmount :{ status :{ type : String,default:'unpaid'}},
       // sdAmount :{ status :{ type:String,  default:'unpaid'}},
        rentAmount:{ status :{ type:String,  default:'unpaid'}, amount:{ type:Number,default:null }, paymentDue:{ type: Date, default:null },paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions' } },
       // rentPaymentStatus:{ type: String, default:'unpaid' },
        paymentDay: { type: Number, default: 5 },
        paymentMonth: {type:String,default:null},
        contractStatus:{type:String,default:"INACTIVE",required:true }, //enums to be added
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },     
    },
    {
        timestamp: true,
    }
);

const Booking = mongoose.model("Booking", schema);

export default Booking;

