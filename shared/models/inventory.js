import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },     
        inventoryId: { type: String, required: true , unique:true},
        propertyName: { type: String, default: null, required: true },
        address: { type: String, default: null, required: true },
        floor: { type: String, default: null, required: true },
        carpetArea: { type: String, default: null, required: true },
        geolocation: { type: String, default: null, },
        mainImage: { type: String, default: null, },
        entranceImage: { type: String, default: null },
        livingImage: { type: String, default: null  },
        kitchenImage: { type: String, default: null  },
        bedroomImage: { type: String, default: null },
        rent:{ type: Number, default: null, required: true },
        securityDeposit:{ type: Number, default: null, required: true },
        occupied:{ type: Boolean, default:false, required: true },
        vacant:{ type: Boolean, default:true, required: true },
        tokenAdvance:{type: Number, default: null},
        isDeleted:{ type: Boolean, default:false, required: true },
        moveInDate: { type: Date, default: null },
        moveOutDate:{ type: Date, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },     
    },
    {
        timestamp: true,
    }
);

const Inventory = mongoose.model("Inventory", schema);

export default Inventory;
