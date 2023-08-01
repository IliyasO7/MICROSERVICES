import { sendResponse } from "../../../../shared/utils/helper.js";
import Vendor from "../../../models/ods/vendor.js";
import Randomstring from "randomstring";
import bcrypt from "bcrypt";

export const createVendor = async (req, res) => {
  console.log("req body is:", req.body);
  let vendorId = await Randomstring.generate({
    length: 8,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  const data = new Vendor({
    vendorId,
    ...req.body,
  });

  await data.save();

  sendResponse(res, 200, "success", data);
};

export const getVendors = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["businessName"] = new RegExp(req.query.name, "i");
  }

  if (req.query.category) {
    filter["category"] = req.query.category;
  }

  if (req.query.subcategory) {
    filter["subcategory"] = req.query.subcategory;
  }

  const data = await Vendor.find(filter).lean();

  sendResponse(res, 200, "success", data);
};

export const getVendorById = async (req, res) => {
  const data = await Vendor.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, "vendor not found");

  sendResponse(res, 200, "success", data);
};

export const updateVendor = async (req, res) => {
  const data = await Vendor.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "vendor not found");

  Object.assign(data, req.body);

  await data.save();

  sendResponse(res, 200, "success", data);
};

export const deleteVendor = async (req, res) => {
  const data = await Vendor.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "vendor not found");

  await data.deleteOne();

  sendResponse(res, 200, "success");
};
