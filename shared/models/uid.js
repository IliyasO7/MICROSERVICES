import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        aadharCardNumber: { type: Number, default: null ,required:true},
        aadharDocument: { type: String, default: null },
        panCardNumber: { type: String, default: null, required: true },
        panCardDocument: { type: String, default: null},
        isVerified: {type:Boolean , default:false},
        verifiedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'admin',}
    },
    {
        timestamp: true,
    }
);

const Uid = mongoose.model("uid", schema);

export default Uid;
