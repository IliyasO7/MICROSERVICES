import { sendResponse } from "../../../../shared/utils/helper.js";
import Order from "../../../models/ods/order.js";

export const getOrders = async (req, res) => {
  const filter = {};
  const data = await Order.find(filter).lean();

  sendResponse(res, 200, "success", data);
};

export const getOrderById = async (req, res) => {
  const data = await Order.findById(req.params.id)
    .lean()
    .populate("services.serviceId");

  if (!data) return sendResponse(res, 404, "order not found");

  sendResponse(res, 200, "success", data);
};

export const updateOrder = async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter["status"] = req.query.status;
  }
  const data = await Order.findById(req.params.id);

  if (!data) return sendResponse(res, 404, "order not found");

  Object.assign(data, filter);

  await data.save();

  sendResponse(res, 200, "success", data);
};

export const deleteOrder = async (req, res) => {
  const data = await Order.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "order not found");

  await data.deleteOne();

  sendResponse(res, 200, "success");
};
