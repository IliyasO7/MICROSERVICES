import mongoose from "mongoose";

const schema = mongoose.Schema(
    { 
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        to : { type: mongoose.Schema.Types.ObjectId, ref: 'user',required:true},    
        bookingId: {  type: mongoose.Schema.Types.ObjectId, ref: 'booking', required: true},
        transactionId: { type: String, default: null },
        paymentDate: { type:Date, required:true },
        amount: { type: Number, default: null  },
        gateway: { type: String, default: null  },
        mode: { type: String, default: null },
        status: { type: String, default: 'Pending' },
    },
    {
        timestamp: true,
    }
);
const rentalTransactions = mongoose.model("rentalTransactions", schema);

export default rentalTransactions;
