import axios from "axios";
import User from "../../models/user.js";
import Bank from "../../models/bank.js";
import Property from "../../models/property.js";
import Contract from "../../models/contract.js";
import fs from "fs";
import { sendResponse } from "../../../shared/utils/helper.js";
import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";

export const createOwner = async (req, res) => {
  let user = await User.findOne({ mobile: req.body.mobile });

  if (user?.proprietor?.isActive) {
    return sendResponse(res, 400, "Owner already exists");
  }

  if (!user) {
    user = new User({
      fname: req.body.fname,
      email: req.body.email,
      mobile: req.body.mobile,
      pan: req.body.pan,
      aadhaar: req.body.aadhaar,
      isProfileCompleted: true,
      proprietor: {
        isActive: true,
        addedBy: req.user._id,
      },
    });
  }

  const bank = new Bank({
    user: user._id,
    name: req.body.bankName,
    accountNumber: req.body.bankAccountNo,
    ifscCode: req.body.bankIfsc,
    default: true,
  });

  await user.save();
  await bank.save();

  sendResponse(res, 200, "Owner Added successful", user);
};

export const getOwners = async (req, res) => {
  const filter = {
    "proprietor.isActive": true,
  };

  if (req.query.mine == "true") {
    filter["proprietor.addedBy"] = req.user._id;
  }

  if (req.query.mobile) {
    filter["mobile"] = req.query.mobile;
  }

  const data = await User.find(filter);

  sendResponse(res, 200, "success", data);
};

export const getOwnerById = async (req, res) => {
  const data = await User.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, "Owner does not exist");

  sendResponse(res, 200, "success", data);
};

export const updateOwnerMedia = async (req, res, next) => {
  try {
    const owner = await User.findOne({
      _id: req.params.id,
    }).lean();

    if (!owner) {
      return sendResponse(res, 400, "Owner Does Not Exist");
    }
    let data = {
      aadhaarDocument: undefined,
      panDocument: undefined,
      cancelledCheque: undefined,
      //serviceAgreementUpload: undefined,
    };

    if (req.files.aadhar) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/aadhars/${req.params.id}-${req.files.aadhar[0].originalname}`,
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
        data.aadhaarDocument = `https://housejoy.b-cdn.net/owner/aadhars/${req.params.id}-${req.files.aadhar[0].originalname}`;
      }
    }

    if (req.files.pan) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/pan/${req.params.id}-${req.files.pan[0].originalname}`,
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
        data.panDocument = `https://housejoy.b-cdn.net/owner/pan/${req.params.id}-${req.files.pan[0].originalname}`;
      }
    }

    if (req.files.cancelledCheque) {
      const options = {
        method: "PUT",
        url: `https://storage.bunnycdn.com/housejoy/owner/cancelledCheque/${req.params.id}-${req.files.cancelledCheque[0].originalname}`,
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
        data.cancelledCheque = `https://housejoy.b-cdn.net/owner/cancelledCheque/${req.params.id}-${req.files.cancelledCheque[0].originalname}`;
      }
    }
    // Update in database
    await User.updateOne(
      { _id: owner._id },
      {
        $set: data,
      }
    );

    sendResponse(res, 200, "success");
  } catch (err) {
    next(err);
  }
};

export const getOwnerProperties = async (req, res) => {
  const data = await Property.find({ proprietor: req.params.id }).lean();

  sendResponse(res, 200, "success", data);
};

export const getOwnerContracts = async (req, res) => {
  const data = await Contract.find({ proprietor: req.params.id }).lean();

  sendResponse(res, 200, "success", data);
};

export const uploadingToS3 = async (req, res) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESSKEY, // store it in .env file to keep it safe
      secretAccessKey: process.env.SECRETKEY,
    },
    region: "ap-south-1", // this is the region that you select in AWS account
  });

  const s3Storage = multerS3({
    s3: s3, //s3 instance
    bucket: process.env.BUCKETNAME, //change it as per your project requirement
    acl: "public-read", //storage access type
    metadata: (req, file, cb) => {
      cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = Date.now() + "_" + file.originalname;
      cb(null, fileName);
    },
  });

  sendResponse(res, 200, "success", data);
};
