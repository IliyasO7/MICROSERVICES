import User from "../../../shared/models/user.js";
import * as smsService from "../../../shared/services/sms.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";
import redis from "../../../shared/utils/redis.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";

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
  //  const cId = req.userData.customerId
  const cId = req.params.cId;
  console.log("CID", cId);
  let user = await User.findById({ _id: cId });
  if (!user) {
    return sendResponse(res, 400, "Profile Does not exist");
  } else {
    return sendResponse(res, 200, "Profile Fetched successfully", { user });
  }
};

/*
// Get profile
export const profile = async (req, res, next) => {
  try {
    let profile = await Customer.findById(
      req.userData.customerId,
      "_id fname lname email phone addresses service country status"
    )
      .populate("service", "name description pricing ")
      .lean();

    if (!profile) {
      throw {
        status: 404,
        message: "Customer not found",
      };
    }

    res.status(200).json({
      result: "success",
      profile: profile,
    });
  } catch (err) {
    next(err);
  }
};
*/
