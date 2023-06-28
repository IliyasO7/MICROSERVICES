const mongoose = require("mongoose");
const randomstring = require("randomstring");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const { phone } = require("phone");
const _ = require("lodash");

// Models
const Customer = require("../../models/customer");
const Service = require("../../models/service");

// Services
const customersService = require("../../services/customers");
const smsService = require("../../services/sms");

// Signup
exports.signup = async (req, res, next) => {
  try {
    console.log("req body", req.body);

    // Format phone number
    let phoneNumber = (await phone(req.body.phone, { country: "IN" }))
      .phoneNumber;

    // Check if customer is already registered
    let customer = await Customer.findOne({ phone: phoneNumber });
    if (customer) {
      throw new Error("Customer already exists, please login");
    }

    // Generate OTP Code
    let otp = await randomstring.generate({ length: 4, charset: "numeric" });

    // create a new customer
    var createCustomer = new Customer({
      _id: mongoose.Types.ObjectId(),
      fname: req.body.fname,
      lname: req.body.lname,
      phone: phoneNumber,
      email: req.body.email,
      "otp.code": otp,
    }).save();

    // Send OTP
    await smsService.send({
      type: "TXN",
      senderId: "HSEJOY",
      templateId: "1107167905500594285",
      phone: phoneNumber,
      message: `Your Signup OTP is ${otp} , Thank you for choosing Housejoy -Sarvaloka Services On Call Pvt Ltd`,
    });

    res.json({
      result: "success",
    });
  } catch (err) {
    next(err);
  }
};

// Send login OTP
exports.sendLoginOtp = async (req, res, next) => {
  try {
    // Format phone number
    let phoneNumber = (await phone(req.body.phone, { country: "IN" }))
      .phoneNumber;

    // Get customer
    let customer = await Customer.findOne({ phone: phoneNumber }).lean();
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Generate OTP Code
    let otp = await randomstring.generate({ length: 4, charset: "numeric" });

    // Send OTP
    await smsService.send({
      type: "TXN",
      senderId: "HSEJOY",
      templateId: "1107167421497698923",
      phone: customer.phone,
      message: `Thanks For Choosing Housejoy & Your Login OTP Is ${otp} -Sarvaloka Services On Call Pvt Ltd`,
    });

    // Update in database
    await Customer.updateOne(
      { _id: customer._id },
      {
        $set: {
          otp: {
            code: otp,
            createdAt: new Date(),
          },
        },
      }
    );

    res.json({
      result: "success",
    });
  } catch (err) {
    next(err);
  }
};

// Verify login OTP
exports.verifyLoginOtp = async (req, res, next) => {
  try {
    // Format phone number
    let phoneNumber = (await phone(req.body.phone, { country: "IN" }))
      .phoneNumber;

    // Get customer
    let customer = await Customer.findOne({ phone: phoneNumber }).lean();
    if (!customer) {
      throw new Error("Customer not found");
    }

    // Verify OTP
    if (req.body.otp != customer.otp.code) {
      throw new Error("Invalid otp code");
    }

    // // Clear OTP from database
    // await Customer.updateOne({ _id: customer._id }, {
    //   $set: {
    //     'otp.code': null
    //   }
    // })

    // Generate token
    let token = await jwt.sign(
      { customerId: customer._id, role: "customer" },
      process.env.JWT_KEY,
      { expiresIn: "6h" }
    );

    res.json({
      result: "success",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

// Get profile
exports.profile = async (req, res, next) => {
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

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    let customer = await customersService.profile(req.userData.customerId);

    // Check if any existing profile exists with given e-mail
    if (customer.email != req.body.email) {
      let exist = await Customer.findOne({ email: req.body.email });
      if (exist) {
        throw {
          status: 409,
          message: "E-mail already in use",
        };
      }
    }

    // Update customer profile
    await Customer.updateOne(
      { _id: req.userData.customerId },
      {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          phone: req.body.phone,
        },
      }
    );

    res.status(200).json({
      result: "success",
      message: "Customer profile updated",
    });
  } catch (err) {
    next(err);
  }
};

// Update password
exports.updatePassword = async (req, res, next) => {
  try {
    let updatePassword = await customersService.updatePassword(
      req.userData.customerId,
      req.body.password
    );

    res.status(200).json({
      result: "success",
      message: "Password updated",
    });
  } catch (err) {
    next(err);
  }
};
