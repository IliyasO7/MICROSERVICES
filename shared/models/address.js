import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        default: { type: Boolean, default: false },
        address: { type: String, default: null, required: true },
        city: { type: String, default: null, required: true },
        state: { type: String, default: null, required: true },
        pincode: { type: String, default: null, required: true },
        country: { type: String, default: null, required: true },
    },
    {
        timestamp: true,
    }
);

const Address = mongoose.model("address", schema);

export default Address;
