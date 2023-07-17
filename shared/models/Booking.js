
import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        bookingId: { type: String, required: true},
        inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory',required:true},  
        tenant : { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true}, 
        currentBookingType:{ type: String,default:'TOKEN' ,enum : ['TOKEN','SECUIRITY','RENT','SERVICE'], required: true}, //enums dalne hai
        tokenAmount :{ status :{ type : String,default:'UNPAID', enum : ['UNPAID','PAID']},amount : { type : Number,default:null },paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions' }},
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service',default:null },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null,},
        serviceStatus: { type:String, default:"PENDING",enum : ["PENDING","ASSIGNED","STARTED","COMPLETED","CANCELLED"]},
        serviceCharge :{ status :{ type:String,  default:'UNPAID', enum : ['UNPAID','PAID']},percentage : { type : Number,default:5,enum:[5,8]},paymentDue: { type: Date,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions'}},
        securityDeposit :{ status :{ type:String,  default:'UNPAID', enum : ['UNPAID','PAID']},amount : { type : Number,default:null},paymentDue: { type: Date,default:null},paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'rentalTransactions'}},
        balanceAmount : { type: Number,default:null },
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

