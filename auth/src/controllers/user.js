import User from "../../../shared/models/user.js";
import Address from "../../../shared/models/address.js";
import Bank from "../../../shared/models/bank.js";
import Uid from "../../../shared/models/uid.js";
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
  let userAddress = await Address.find({user: customerData._id});
  let uid = await Uid.find({ user:customerData._id });
  let bankDetails = await Bank.find({ user:customerData._id });

  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {
    return sendResponse(res, 200, "Profile Fetched successfully", { user,userAddress,bankDetails,uid });
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
   
          let createNewAddress = await Address.create(
            {
                  user:customerData._id,
                  default: defaultValue,
                  address: address,
                  city: city,
                  state: state,
                  pincode: pincode, 
                  country:country,
            })
            return sendResponse(res, 200, "New Address Added Successfully", { createNewAddress });
    
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

          let updateAddress = await Address.updateOne(
            { user:customerData._id },
            {
                  default: defaultValue,
                  address: address,
                  city: city,
                  state: state,
                  pincode: pincode, 
                  country:country,
            })
            return sendResponse(res, 200, "New Address Updated Successfully", { updateAddress });
         
};


//GET ADDRESS
export const getAddress = async (req, res) => {
  const customerData = req.user;

       let userAddress = await Address.find({ user:customerData._id });
       return sendResponse(res, 200, "Address Fetched Successfully", { userAddress });
};


//set Default Address
export const setDefaultAddress = async (req, res) => {
  const customerData = req.user;
  const setDefault = req.body.default; 

       let updateDefaultAddress = await Address.updateOne(
        { user:customerData._id },
        {
          default:setDefault
        });
       return sendResponse(res, 200, "Address Fetched Successfully", { updateDefaultAddress });
};

//Delete Address
export const deleteAddress = async (req, res) => {
  const addressID = req.params.addressId;
       let deletedAddress = await Address.deleteOne({ _id: addressID });
       return sendResponse(res, 200, "Address Deleted Successfully");
};

//Update User Role
export const userRoleUpdate = async (req, res) => {
  const tenantStatus = false || req.body.isTenant;
  const ownerStatus = false || req.body.isOwner;
  const mobile = req.body.mobile;

    let roleUpdate = await User.updateOne(
        { mobile:mobile },
        { 
          isTenant:tenantStatus,
          isOwner: ownerStatus
        })
        return sendResponse(res, 200, "Role Updated Successfully", { roleUpdate });
};


//Add User Bank Details
export const addBankDetails = async (req, res) => {
  const customerData = req.user;
  const name = req.body.name;
  const accountNo = req.body.accountNumber;
  const ifsc = req.body.ifscCode;
  const defaultValue = false || req.body.default; 

    let bankDetail = await Bank.create(
        { 
          user:customerData._id,
          name:name,
          accountNumber:accountNo,
          ifscCode: ifsc,
          default:defaultValue

        })                
        return sendResponse(res, 200, "Bank Details added Successfully", { bankDetail });
};

//Update User Bank Details
export const updateBankDetails = async (req, res) => {
  const customerData = req.user;
  const name = req.body.name;
  const accountNo = req.body.accountNumber;
  const ifsc = req.body.ifscCode;
 
    let bankDetail = await Bank.updateOne(
        { user:customerData._id,},
        { 
          name:name,
          accountNumber:accountNo,
          ifscCode: ifsc,
        })                
        return sendResponse(res, 200, "Bank Details updated Successfully", { bankDetail });
};

//GET BANK DETAILS
export const getBankDetails = async (req, res) => {
  const customerData = req.user;
       let bankDetails = await Bank.find({ user:customerData._id });
       return sendResponse(res, 200, "Bank Details Fetched Successfully", { bankDetails });
};


//Add User Uid Details
export const addUid = async (req, res) => {
  const customerData = req.user;
  const aadharNo = req.body.aadharCardNumber;
  const panNo = req.body.panCardNumber;
    let uIdDetails = await Uid.create(
        { 
          user:customerData._id,
          aadharCardNumber:  aadharNo,
          panCardNumber: panNo,
        })                
        return sendResponse(res, 200, "UID Details added Successfully", { uIdDetails });
};

//GET Uid DETAILS
export const getUidDetails = async (req, res) => {
  const customerData = req.user;
       let uidDetails = await Uid.find({ user:customerData._id });
       return sendResponse(res, 200, "UID Details Fetched Successfully", { uidDetails });
};


export const saveOwner = async (req, res) => {

  const fname = req.body.fname;
  const email = req.body.email;
  const phone = req.body.mobile;
  const name = req.body.name;
  const accountNo = req.body.accountNumber;
  const ifsc = req.body.ifscCode;
  const aadharNo = req.body.aadharCardNumber;
  const panNo = req.body.panCardNumber;
  const ownerStatus = req.body.isOwner;

      const saveUser = await User.create(
        {
          fname: fname,
          email: email,
          mobile: phone,
          isOwner:ownerStatus
        });
    
        let userBankDetails = await Bank.create(
          { 
            user:saveUser._id,
            name:name,
            accountNumber:accountNo,
            ifscCode: ifsc,
            default:true 

          }) 

        let uIdDetails = await Uid.create(
          { 
            user:saveUser._id,
            aadharCardNumber:  aadharNo,
            panCardNumber: panNo,
          }) 

  sendResponse(res, 200, "Owner Added successful", {saveUser,userBankDetails,uIdDetails});
};