
import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        bookingId: { type: String, required: true},
        inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true},  
        tenant : { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true}, 
        currentBookingType:{ type: String,default:'TOKEN' ,enum : ['TOKEN','SECUIRITY','RENT','SERVICE'], required: true}, //enums dalne hai
        tokenAmount :{ status :{ type : String,default:'UNPAID', enum : ['UNPAID','PAID']},amount : { type : Number,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions' }},
        serviceCharge :{ status :{ type:String,  default:'UNPAID', enum : ['UNPAID','PAID']},amount : { type : Number,default:null},paymentDue: { type: Date,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions'}},
        securityDeposit :{ status :{ type:String,  default:'UNPAID', enum : ['UNPAID','PAID']},amount : { type : Number,default:null},paymentDue: { type: Date,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions'}},
       // totalAmount :{ status :{ type : String,default:'unpaid'}}, pending
       // sdAmount :{ status :{ type:String,  default:'unpaid'}},
       // rentAmount:{ status :{ type:String,  default:'unpaid'}, amount:{ type:Number,default:null }, paymentDue:{ type: Date, default:null },paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions' } },
       // rentPaymentStatus:{ type: String, default:'unpaid' },
        rentPayment: {  status :{ type : String,default:'UNPAID', enum : ['UNPAID','PAID'] }},
        paymentDay: { type: Number, default: 5 },
        contractStatus:{type:String,default:"INACTIVE" , enum : ['ACTIVE','INACTIVE'],required:true }, //enums to be added
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },     
    },
    {
        timestamp: true,
    }
);

const Booking = mongoose.model("Booking", schema);

export default Booking;

