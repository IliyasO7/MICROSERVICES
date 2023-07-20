import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor', required: true},
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'order' },  
    vendorToUserRating: {
        overallRating:{ type: Number, default: null },
        service: { type: Number, default: null },
        behaviour: { type: Number, default: null },
        cleaning: { type: Number, default: null },
        feedback: { type: String, default: null },
      },
    userToVendorRating: {
        overallRating:{ type: Number, default: null },
        service: { type: Number, default: null },
        behaviour: { type: Number, default: null },
        cleaning: { type: Number, default: null },
        feedback: { type: String, default: null },
    },
    isProfileCompleted: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const Rating = mongoose.model("rating", schema);

export default Rating;
