import { sendResponse } from '../../../../shared/utils/helper.js';
import Order, { OrderStatus } from '../../../../shared/models/ods/order.js';
import Vendor from '../../../../shared/models/ods/vendor.js';

export const getOrders = async (req, res) => {
  const filter = { status: { $ne: OrderStatus.PENDING } };
  const offset = parseInt(req.query.offset || 0);
  const limit = parseInt(req.query.limit || 100);

  if (req.query.orderId) {
    filter['orderId'] = new RegExp(req.query.orderId, 'i');
  }

  if (req.query.serviceId) {
    filter['service'] = req.query.serviceId;
  }

  if (req.query.status) {
    filter['status'] = req.query.status;
  }

  if (req.query.pincode) {
    filter['address.pincode'] = new RegExp(req.query.pincode, 'i');
  }

  if (req.query.userId) {
    filter['user'] = req.query.userId;
  }

  if (req.query.vendorId) {
    filter['vendor'] = req.query.vendorId;
  }

  const data = await Order.find(filter)
    .lean()
    .populate('service', 'name')
    .populate('user', 'fname lname mobile')
    .skip(offset)
    .limit(limit);

  const payload = data.map((item) => ({
    _id: item._id,
    orderId: item.orderId,
    service: item.service,
    user: item.user,
    totalAmount: item.paymentSummary.totalAmount,
    scheduledDate: item.scheduledDate,
    address: item.address,
    createdAt: item.createdAt,
    placedAt: item.placedAt,
    assignedAt: item.assignedAt ?? '',
    startedAt: item.startedAt ?? '',
    completedAt: item.completedAt ?? '',
    cancelledAt: item.cancelledAt ?? '',
    status: item.status,
  }));

  sendResponse(res, 200, 'success', payload);
};

export const getOrderById = async (req, res) => {
  const data = await Order.findById(req.params.id)
    .lean()
    .populate('service', 'name image category')
    .populate('user', 'fname lname mobile email image');

  if (!data) return sendResponse(res, 404, 'order not found');

  sendResponse(res, 200, 'success', data);
};

export const updateOrder = async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter['status'] = req.query.status;
  }
  const data = await Order.findById(req.params.id);

  if (!data) return sendResponse(res, 404, 'order not found');

  Object.assign(data, filter);

  await data.save();

  sendResponse(res, 200, 'success', data);
};

export const deleteOrder = async (req, res) => {
  const data = await Order.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'order not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};

export const assignVendor = async (req, res) => {
  const data = await Order.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'order not found');

  if (data.status !== OrderStatus.PLACED) {
    return sendResponse(res, 400, 'order is not in placed status');
  }

  const vendor = await Vendor.findById(req.body.vendorId).lean();
  if (!vendor) return sendResponse(res, 400, 'vendor does not exist');

  // enable in production
  // if (!vendor.services.some((item) => item.equals(data.service))) {
  //   return sendResponse(res, 400, 'vendor does not provide this service');
  // }

  data.vendor = vendor._id;
  data.status = OrderStatus.ASSIGNED;
  data.assignedAt = new Date();

  await data.save();

  sendResponse(res, 200, 'successful', data);
};
