import User from "../../../shared/models/user.js";
import Vendor from "../../../shared/models/vendor.js";
import Address from "../../../shared/models/address.js";
import Bank from "../../../shared/models/bank.js";
import Uid from "../../../shared/models/uid.js";
import Inventory from "../../../shared/models/inventory.js";
import Booking from "../../../shared/models/Booking.js";
import RentalTransactions from "../../../shared/models/rentalTransactions.js";
import RentalTenant from "../../../shared/models/rentalTental.js";
import RentalOwner from "../../../shared/models/rentalOwner.js";
import * as smsService from "../../../shared/services/sms.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";
import redis from "../../../shared/utils/redis.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import rentalTenant from "../../../shared/models/rentalTental.js";
import fs from 'fs';
import axios from "axios";
//import { uploadToBunnyCdn } from "../../../shared/utils/bunnycdn.js";
import Service from "../../../shared/models/service.js";

//import mongoose  from "mongoose";
export const sendOtp = async (req, res) => {
 
  const otp = "0000" || generateOtp();

  await redis.setEx(
    `mobile:${req.body.mobile}`,
    60 * 3,
    await bcrypt.hash(otp, 12)
  );
  // const [data, err] = await smsService.send({
  //   type: "TXN",
  //   senderId: "HSEJOY",
  //   templateId: "1107167421497698923",
  //   mobile: req.body.mobile,
  //   message: `Thanks For Choosing Housejoy & Your Login OTP Is ${otp} -Sarvaloka Services On Call Pvt Ltd`,
  // });
  // console.log(data);
  // if (err) {
  //   return sendResponse(res, 400, "something went wrong");
  // }
  sendResponse(res, 200, "Success");
};

export const verifyOtp = async (req, res) => {
  const mobile = req.body.mobile;
  const key = `mobile:${mobile}`;
  const otp = await redis.get(key);

  const isValid = await bcrypt.compare(req.body.otp, otp || "");
  if (!isValid) return sendResponse(res, 400, "Invalid OTP");

  let user = await User.findOne({ mobile: req.body.mobile });
  if (!user) {
    user = await User.create({ mobile: req.body.mobile });
  }
  await redis.del(key);
  const tokens = generateTokens({ userId: user._id });
  sendResponse(res, 200, "Otp Verified", { user, ...tokens });
};


export const login = async (req, res) => {
try{
    // Check login
   let vendor = await Vendor.findOne({ phone: phone }).lean()

   if (!vendor) {
     return sendResponse(res, 400, "Invalid OTP");
   }
   // Verify password
   let verifyPassword = await bcrypt.compare(password, vendor.password)

   if (verifyPassword) {
        // Save FCM token
        let fcm =  await Vendor.updateOne({ _id: vendor._id }, {
          $set: {
            "fcmToken": req.body.fcmToken || null
          }
        })
      const tokens = generateTokens({ userId : vendor._id }); 
      sendResponse(res, 200, "success", { vendor, ...tokens });
      
   } else {
      return sendResponse(res, 400, "Invalid Credentials");
    }
}
catch(err){
  next(err)
  }
};



export const logOut = async (req, res) => {
  try{
    sendResponse(res, 200, "success");
  }
  catch(err){
    next(err)
    }
  };

export const profile = async (req, res) => {
    try{
      let profile = await Vendor.findById(req.user._id).populate().lean()
      if (!profile) {
        return sendResponse(res, 400, "Profile Not Found");
      }
     return sendResponse(res, 200, "success", { profile: _.omit(profile, ['password', 'aadharCardNumber', 'aadhar', 'bankDocument', 'gstDocumentUpload', 'agreementUpload', 'paymentReceiptNumber', 'paymentReceipt', 'payment']) });
    }
    catch(err){
      next(err)
      }
 };
  

 export const updateProfile = async (req, res) => {
  try{
    let profile = await Vendor.findById(req.user._id).populate().lean()
    if (!profile) {
      return sendResponse(res, 400, "Profile Not Found");
    }
   return sendResponse(res, 200, "success", { profile: _.omit(profile, ['password', 'aadharCardNumber', 'aadhar', 'bankDocument', 'gstDocumentUpload', 'agreementUpload', 'paymentReceiptNumber', 'paymentReceipt', 'payment']) });
  }
  catch(err){
    next(err)
    }
};


export const getAssets = async (req, res) => {

    const services  = await Service.find({})
    let assets= [];

    for(var i=0;i<services.length;i++){
      let service = {}
      service.icon = services[i].icon
      service.name = services[i].name
      service.slug = services[i].slug
      assets.push(service)
    }

   // for(let eachService in services){
    //  console.log("EACH SERVICE",eachService);
   //   service.icon = eachService.icon
   //   service.name = eachService.name
   //   service.slug = eachService.slug
   //   
    //}
    return sendResponse(res, 200, "Assets fetcehd Succesfully", {assets});

     //   if(services) sendResponse(res, 200, "Services Fetched SucccessFully", {services});

};
