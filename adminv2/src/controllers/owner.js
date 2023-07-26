//import User from "../../../shared/models/user.js";
import Inventory from "../../../shared/models/inventory.js";
import Booking from "../../../shared/models/Booking.js";
//import Bank from "../../../shared/models/bank.js";
import RentalTransactions from "../../../shared/models/rentalTransactions.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import RentalOwner from "../../../shared/models/rentalOwner.js";
import axios from "axios";
import User from "../../models/user.js";
import Bank from "../../models/bank.js";
import Property from "../../models/property.js";
import Contract from "../../models/contract.js";

export const getOwner = async (req, res) => {
  const mobile = req.params.mobile;
  const user = await User.findOne({
    mobile: mobile,
    "proprietor.isActive": true,
  });
  if (user) {
    const propertyDetails = await Property.find({
      proprietor: user._id,
    }).populate("proprietor.isActive");

    const contracts = await Contract.find({ proprietor: user._id });

    return sendResponse(res, 200, "Owner Details Fetched Succesfully", {
      user,
      propertyDetails,
      contracts,
    });
  } else {
    return sendResponse(res, 404, "Owner Does Not Exist");
  }
};

/*
export const createOwner = async (req, res) => {

    const fname = req.body.fname;
    const email = req.body.email;
    const phone = req.body.mobile;
    const name = req.body.name;
    const accountNo = req.body.accountNumber;
    const ifsc = req.body.ifscCode;
    const aadharNo = req.body.aadharCardNumber;
    const panNo = req.body.panCardNumber;
    const ownerStatus = req.body.isOwner;

    const admin = req.user;

    const userCheck = await User.findOne({mobile: phone})
    if(userCheck){
      const ownerCheck = await RentalOwner.find({user:userCheck._id})
      if(ownerCheck){
        sendResponse(res, 400, "Owner Already Exists", );
      }
    }

        const saveUser = await User.create(
          {
            fname: fname,
            email: email,
            mobile: phone,
            isProfileCompleted:true,
          });

          const createOwner = await RentalOwner.create({
            user:saveUser,
       //     aadhar:req.body.aadhar,
      //      pan:req.body.pan,
      //      cancelledCheque: req.body.cancelledCheque,
            createdBy:admin,
            aadharCardNumber:aadharNo,
            panCardNumber: panNo,
          })
      
          let userBankDetails = await Bank.create(
            { 
              user:createOwner.user,
              name:name,
              accountNumber:accountNo,
              ifscCode: ifsc,
              default:true ,
              
            }) 
  
    sendResponse(res, 200, "Owner Added successful", {owner:createOwner,userBankDetails});
  };
*/

export const createOwner = async (req, res) => {
  console.log("hey");

  const fname = req.body.fname;
  const email = req.body.email;
  const phone = req.body.mobile;
  const name = req.body.name;
  const accountNo = req.body.accountNumber;
  const ifsc = req.body.ifscCode;
  const aadharNo = req.body.aadharCardNumber;
  const panNo = req.body.panCardNumber;
  const ownerStatus = req.body.isOwner;
  const admin = req.user;
  const userCheck = await User.findOne({ mobile: phone });

  if (userCheck) {
    const ownerCheck = await User.findOne({
      _id: userCheck._id,
      "proprietor.isActive": true,
    });
    console.log("owner check", ownerCheck);
    if (ownerCheck) {
      return sendResponse(res, 400, "Owner Already Exists");
    }
  }
  const saveUser = await User.create({
    fname: fname,
    email: email,
    mobile: phone,
    isProfileCompleted: true,
    "proprietor.isActive": true,
    "proprietor.addedBy": admin,
    pan: panNo,
    aadhaar: aadharNo,
  });

  let userBankDetails = await Bank.create({
    user: saveUser,
    name: name,
    accountNumber: accountNo,
    ifscCode: ifsc,
    default: true,
  });

  sendResponse(res, 200, "Owner Added successful", {
    owner: saveUser,
    userBankDetails,
  });
};

export const updateOwner = async (req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const phone = req.body.mobile;
  const name = req.body.name;
  const accountNo = req.body.accountNumber;
  const ifsc = req.body.ifscCode;
  const aadharNo = req.body.aadharCardNumber;
  const panNo = req.body.panCardNumber;
  const ownerStatus = req.body.isOwner;
  const admin = req.user;

  const saveUser = await User.updateOne(
    { mobile: phone },
    {
      fname: fname,
      email: email,
    }
  );
  const user = await User.find({ mobile: phone });

  const updateOwner = await RentalOwner.updateOne(
    { user: user },
    {
      aadharCardNumber: aadharNo,
      panCardNumber: panNo,
    }
  );

  let userBankDetails = await Bank.updateOne(
    { user: user },
    {
      name: name,
      accountNumber: accountNo,
      ifscCode: ifsc,
      default: true,
    }
  );

  sendResponse(res, 200, "Owner Details Udpated Successfully");
};

export const getAdminOwners = async (req, res) => {
  const admin = req.user;
  const owner = await User.find({
    "proprietor.addedBy": admin._id,
    "proprietor.isActive": true,
  })
    .populate("user")
    .populate("proprietor.addedBy");
  if (owner) {
    return sendResponse(res, 200, "Owner List Fetched", { owner });
  } else {
    return sendResponse(res, 400, "User Does Not Exist As Owner");
  }
};

export const getAllOwners = async (req, res) => {
  const ownerList = await User.find({ "proprietor.isActive": true })
    .populate("user")
    .populate("proprietor.addedBy");

  return sendResponse(res, 200, "Owner List Fetched", { ownerList });
};

// Update Owner media
export const updateOwnerMedia = async (req, res, next) => {
  try {
    //   const bunnyStorage = await new BunnyStorage(process.env.BUNNYCDN_API_KEY, process.env.BUNNYCDN_STORAGE_ZONE);
    //   console.log('Req.body',req);
    let owner = await RentalOwner.findOne({ user: req.params.ownerId }).lean();

    if (!owner) {
      return sendResponse(res, 400, "Owner Does Not Exist");
    }
    let data = {
      aadhar: undefined,
      pan: undefined,
      cancelledCheque: undefined,
      //serviceAgreementUpload: undefined,
    };

    if (req.files.aadhar) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/aadhars/${req.params.ownerId}-${req.files.aadhar[0].originalname}`,
        headers: {
          AccessKey: process.env.BUNNYCDN_API_KEY,
          "content-type": "multipart/form-data",
        },
        data: fs.readFileSync(req.files.aadhar[0].path),
      };
      const OwnerAdhr = await axios(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
      if (OwnerAdhr.status === 201) {
        data.aadhar = `https://housejoy.b-cdn.net/owner/aadhars/${req.params.ownerId}-${req.files.aadhar[0].originalname}`;
      }
    }

    if (req.files.pan) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/pan/${req.params.ownerId}-${req.files.pan[0].originalname}`,
        headers: {
          AccessKey: process.env.BUNNYCDN_API_KEY,
          "content-type": "multipart/form-data",
        },
        data: fs.readFileSync(req.files.pan[0].path),
      };
      const OwnerPan = await axios(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
      });
      if (OwnerPan.status === 201) {
        data.pan = `https://housejoy.b-cdn.net/owner/pan/${req.params.ownerId}-${req.files.pan[0].originalname}`;
      }
    }

    if (req.files.cancelledCheque) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/cancelledCheque/${req.params.ownerId}-${req.files.cancelledCheque[0].originalname}`,
        headers: {
          AccessKey: process.env.BUNNYCDN_API_KEY,
          "content-type": "multipart/form-data",
        },
        data: fs.readFileSync(req.files.cancelledCheque[0].path),
      };
      const OwnerCancelledCheque = await axios(
        options,
        function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
        }
      );
      if (OwnerCancelledCheque.status === 201) {
        data.cancelledCheque = `https://housejoy.b-cdn.net/owner/cancelledCheque/${req.params.ownerId}-${req.files.cancelledCheque[0].originalname}`;
      }
    }
    // Update in database
    await RentalOwner.updateOne(
      { _id: owner._id },
      {
        $set: data,
      }
    );

    res.json({
      result: "success",
    });
  } catch (err) {
    next(err);
  }
};
