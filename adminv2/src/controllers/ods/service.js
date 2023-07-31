import { sendResponse } from "../../../../shared/utils/helper.js";
import Service from "../../../models/ods/service.js";

export const createService = async (req, res) => {
  console.log("req body", req.body);
  const data = new Service({
    ...req.body,
  });

  await data.save();

  sendResponse(res, 200, "success", data);
};

export const getServices = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["name"] = new RegExp(req.query.name, "i");
  }

  if (req.query.category) {
    filter["category"] = req.query.category;
  }

  if (req.query.subcategory) {
    filter["subcategory"] = req.query.subcategory;
  }

  const data = await Service.find(filter).lean();

  sendResponse(res, 200, "success", data);
};

export const getServiceById = async (req, res) => {
  const data = await Service.findById(req.params.id)
    .lean()
    .populate("category")
    .populate("subcategory");
  if (!data) return sendResponse(res, 404, "service not found");

  sendResponse(res, 200, "success", data);
};

export const updateService = async (req, res) => {
  const data = await Service.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "service not found");

  Object.assign(data, req.body);

  await data.save();

  sendResponse(res, 200, "success", data);
};

export const deleteService = async (req, res) => {
  const data = await Service.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "service not found");

  await data.deleteOne();

  sendResponse(res, 200, "success");
};
