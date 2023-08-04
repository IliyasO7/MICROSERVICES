import User from "../../../shared/models/user.js";
import Vendor from "../../../shared/models/ods/vendor.js";
import * as smsService from "../../../shared/services/sms.js";
import { generateOtp, sendResponse } from "../../../shared/utils/helper.js";
import redis from "../../../shared/utils/redis.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import fs from "fs";
import axios from "axios";
import Service from "../../../shared/models/ods/service.js";
import _ from "lodash";
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

export const login = async (req, res, next) => {
  try {
    console.log("here");
    // Check login
    let vendor = await Vendor.findOne({ phone: req.body.phone }).lean();

    if (!vendor) {
      return sendResponse(res, 400, "Vendor Not Found");
    }
    // Verify password
    console.log("password", vendor.password);
    let verifyPassword = await bcrypt.compare(
      req.body.password,
      vendor.password
    );

    if (verifyPassword) {
      // Save FCM token
      let fcm = await Vendor.updateOne(
        { _id: vendor._id },
        {
          $set: {
            fcmToken: req.body.fcmToken || null,
          },
        }
      );
      const tokens = generateTokens({ userId: vendor._id });
      sendResponse(res, 200, "success", { vendor, ...tokens });
    } else {
      return sendResponse(res, 400, "Invalid Credentials");
    }
  } catch (err) {
    next(err);
  }
};

export const logOut = async (req, res) => {
  try {
    sendResponse(res, 200, "success");
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    let profile = await Vendor.findById(req.user._id).populate().lean();
    if (!profile) {
      return sendResponse(res, 400, "Profile Not Found");
    }
    return sendResponse(res, 200, "success", {
      profile: _.omit(profile, [
        "password",
        "aadharCardNumber",
        "aadhar",
        "bankDocument",
        "gstDocumentUpload",
        "agreementUpload",
        "paymentReceiptNumber",
        "paymentReceipt",
        "payment",
      ]),
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res) => {
  try {
    let vendor = await Vendor.findById({ _id: req.user });
    // Check if any existing profile exists with given phone
    if (vendor.phone != req.body.phone) {
      let exist = await Vendor.findOne({ phone: req.body.phone });
      if (exist) {
        return sendResponse(res, 409, "phone already in use");
      }
    }
    // Update vendor profile
    await Vendor.updateOne(
      { _id: req.params.vendorId },
      {
        $set: {
          fName: req.body.fName,
          lName: req.body.lName,
          phone: req.body.phone,
          additionalMobileNumber: req.body.additionalMobileNumber,
        },
      }
    );
    return sendResponse(res, 200, "vendor Updated Successfully");
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    console.log("inside udpate password");
    let vendor = await Vendor.findOne({ _id: req.user });
    console.log("vendor password", vendor.password);

    let passwordCheck = await bcrypt.compare(
      vendor.password,
      req.body.oldpassword
    );

    if (passwordCheck) {
      console.log("compare success");
      // Hash password
      let encryptedPassword = await bcrypt.hash(req.body.newpassword, 10);
      // Update
      await Vendor.updateOne(
        { _id: vendor._id },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      return sendResponse(res, 200, "password updated success");
    } else {
      return sendResponse(res, 409, "old passwords do not match");
    }
  } catch (err) {
    next(err);
  }
};

export const getAssets = async (req, res) => {
  const services = await Service.find({});
  let assets = [];
  for (var i = 0; i < services.length; i++) {
    let service = {};
    service.icon = services[i].icon;
    service.name = services[i].name;
    service.slug = services[i].slug;
    assets.push(service);
  }
  // for(let eachService in services){
  //  console.log("EACH SERVICE",eachService);
  //   service.icon = eachService.icon
  //   service.name = eachService.name
  //   service.slug = eachService.slug
  //
  //}
  return sendResponse(res, 200, "Assets fetcehd Succesfully", { assets });
  //   if(services) sendResponse(res, 200, "Services Fetched SucccessFully", {services});
};

export const testExample = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    // Get order
    let order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.user,
    })
      .populate("customer", "fname lname email phone")
      .populate("vendor", "vendorId ownerName businessName phone")
      .populate("service", "name")
      .lean();
    if (!order) {
      return sendResponse(res, 400, "Order Not Found");
    }

    switch (req.body.status) {
      case "accept":
        await Order.updateOne(
          { _id: req.params.orderId },
          {
            $set: {
              status: "Assigned",
            },
          }
        );

        // Send SMS
        await smsService.send({
          type: "TXN",
          senderId: "HSEJOY",
          templateId: "1107167903398363444",
          phone: order.customer.phone,
          message: `HouseJoy: We have assigned ${order.vendor.ownerName} for your ${order.service.name} with booking ID:${order.orderId}.
                 Contact No: ${order.vendor.phone}. Scheduled service: ${order.serviceDate} The price will be quoted upon inspection by our professional partner. Kindly pay the Inspection Charge if you choose not to avail of the service after the visit. Book again at ${process.env.HOUSEJOY_URL}.`,
        });
        break;

      case "reject":
        await Order.updateOne(
          { _id: req.params.orderId },
          {
            $set: {
              vendor: null,
              status: "Pending",
              rejectionReason: req.body.rejectionReason,
            },
          }
        );

        break;

      case "start":
        await Order.updateOne(
          { _id: req.params.orderId },
          {
            $set: {
              status: "Started",
            },
          }
        );

        // Send SMS
        await smsService.send({
          type: "TXN",
          senderId: "HSEJOY",
          templateId: "1107167903334830945",
          phone: order.customer.phone,
          message: `Housejoy: ${order.vendor.ownerName} Phone no ${order.vendor.phone} has started the ${order.service.name} with booking ID: ${order.orderId}. You can pay online on the app or website under My Orders.${process.env.HOUSEJOY_URL} -Sarvaloka Services On Call Pvt Ltd`,
        });
        break;

      case "cancel":
        await Order.updateOne(
          { _id: req.params.orderId },
          {
            $set: {
              status: "Cancelled",
              cancellationReason: req.body.cancellationReason,
            },
          }
        );

        // Send SMS
        await smsService.send({
          type: "TXN",
          senderId: "HSEJOY",
          templateId: "1107167223463634714",
          phone: order.customer.phone,
          message: `Hi${order.customer.fname}, the service requested by ${order.vendor.ownerName} got cancelled due to a change of plans. -Sarvaloka Services On Call Pvt Ltd`,
        });
        break;

      default:
        break;
    }
    return sendResponse(res, 200, "Order Updated Success");
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    let filters = {
      vendor: req.user.vendorId,
      status: req.query.status || undefined,
    };
    let orders = await Order.find(
      _.omitBy(filters, _.isNil),
      "orderId customer service payment createdAt status serviceDate serviceTime assignedAt"
    )
      .populate("customer", "_id fname lname email phone")
      .populate("service", "name category")
      .lean();

    return sendResponse(res, 200, "success", {
      count: orders.length,
      orders: orders,
    });
  } catch (err) {
    next(err);
  }
};

export const orderDetails = async (req, res, next) => {
  try {
    let order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.user.vendorId,
    })
      .populate("customer", "fname lname phone email")
      .populate("service", "name slug category")
      .lean();
    if (!order) {
      return sendResponse(res, 404, "order not found");
    }
    return sendResponse(res, 200, "success", { order: order });
  } catch (err) {
    next(err);
  }
};

export const updatePrice = async (req, res, next) => {
  try {
    let order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.user.vendorId,
    }).lean();
    if (!order) {
      return sendResponse(res, 400, "order Not found");
    }
    // Update price
    await Order.updateOne(
      { _id: req.params.orderId },
      {
        $set: {
          payment: req.body.payment,
        },
      }
    );
    return sendResponse(res, 200, "price updated successfully");
  } catch (err) {
    next(err);
  }
};

export const sendJobCompletionOtp = async (req, res, next) => {
  try {
    let order = await Order.findOne({
      _id: req.params.orderId,
      vendor: req.user,
    })
      .populate("customer", "fname lname phone email")
      .lean();
    if (!order) {
      throw new Error(`Order not found`);
    }
    const otp = "0000" || generateOtp();
    await redis.setEx(
      `mobile:${order.customer.phone}`,
      60 * 3,
      await bcrypt.hash(otp, 12)
    );
    // Send OTP
    await smsService.send({
      type: "TXN",
      senderId: "HSEJOY",
      templateId: "1107167674560761949",
      phone: order.customer.phone,
      message: `Dear ${order.customer.fname},
      Our expert has attempted to complete the job. Please share OTP ${otp} if the job is completed. Reach out to ${process.env.HELPLINE_NUMBER} if the attempt is wrong. Happy Service -Sarvaloka Services On Call Pvt Ltd`,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyJobCompletionOtp = async (req, res, next) => {
  try {
    const mobile = req.body.mobile;
    const key = `mobile:${mobile}`;
    const otp = await redis.get(key);

    const isValid = await bcrypt.compare(req.body.otp, otp || "");
    if (!isValid) {
      return sendResponse(res, 400, "Invalid OTP");
    } else {
      // Update Order status
      let order = await Order.findOne({ orderId: req.params.orderId });
      await Order.updateOne(
        { _id: order._id },
        {
          $set: {
            status: "Completed",
          },
        }
      );
      await redis.del(key);
      sendResponse(res, 200, "Order Updated as Comlpeted");
    }
  } catch (err) {
    next(err);
  }
};
