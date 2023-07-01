import User from "../../../shared/models/user.js";
import Address from "../../../shared/models/address.js";
import * as smsService from "../../../shared/services/sms.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";
import redis from "../../../shared/utils/redis.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
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

export const updateProfile = async (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const saveUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      fname: fname,
      lname: lname,
      email: email,
      isProfileCompleted: true,
    },
    {
      new: true,
    }
  );

  sendResponse(res, 200, "User SignUp successful", saveUser);
};

//Get Profile by ID [Populate services later ]
export const getprofile = async (req, res) => {
  const customerData = req.user;
  console.log('Data',customerData);
  let user = await User.findById({ _id: customerData._id });
  let userAddress = await Address.find({user: user});
  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {
    return sendResponse(res, 200, "Profile Fetched successfully", { user,userAddress });
  }
};


//ADD CUSTOMER ADDRESS
export const addAddress = async (req, res) => {

  const customerData = req.user;
  const address= req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const pincode= req.body.pincode;
  const country= req.body.country;
  const defaultValue = req.body.default

  let user = await User.findById({ _id: customerData._id });
  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {    
          let createNewAddress = await Address.create(
            {
                  user:user,
                  default: defaultValue,
                  address: address,
                  city: city,
                  state: state,
                  pincode: pincode, 
                  country:country,
            })
            return sendResponse(res, 200, "New Address Added Successfully", { createNewAddress });
         }
};

//UPDATE ADDRESS
export const updateAddress = async (req, res) => {

  const customerData = req.user;
  const address= req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const pincode= req.body.pincode;
  const country= req.body.country;
  const defaultValue = req.body.default

  let user = await User.findById({ _id: customerData._id });
  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {    
          let updateAddress = await Address.updateOne(
            { user:user },
            {
                  default: defaultValue,
                  address: address,
                  city: city,
                  state: state,
                  pincode: pincode, 
                  country:country,
            })
            return sendResponse(res, 200, "New Address Updated Successfully", { updateAddress });
         }
};


//GET ADDRESS
export const getAddress = async (req, res) => {
  const customerData = req.user;
  let user = await User.findById({ _id: customerData._id });
  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {  

       let userAddress = await Address.find({ user:user });
       return sendResponse(res, 200, "Address Fetched Successfully", { userAddress });
    
    }
};