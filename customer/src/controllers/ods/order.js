import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import Cart from '../../../../shared/models/ods/cart.js';
import Order, { OrderStatus } from '../../../../shared/models/ods/order.js';
import {
  generateOrderId,
  roundValue,
  sendResponse,
} from '../../../../shared/utils/helper.js';
import Address from '../../../../shared/models/address.js';
import {
  createPaymentOrder,
  razorpay,
  verifyPayment,
} from '../../../../shared/services/razorpay.js';
import Payment from '../../../../shared/models/payment.js';

dayjs.extend(customParseFormat);

const getRate = (packageData, subPackageId = null) => {
  const subPackage = packageData.subPackages?.find((item) =>
    item._id.equals(subPackageId)
  );
  if (!subPackageId) return packageData.price;

  return subPackage.prices;
};

export const getOrderSummary = async (req, res) => {
  const cartId = req.query.cartId;
  if (!cartId) return sendResponse(res, 400, 'cartId is required');

  const cart = await Cart.findOne({
    _id: cartId,
    user: req.user._id,
    isActive: true,
  })
    .populate('service')
    .populate('items.packageId')
    .lean();

  if (!cart) return sendResponse(res, 404, 'cart not found');

  const paymentSummary = {
    itemAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
  };

  const items = cart.items.map((item) => {
    const subPackage = item.packageId.subPackages.find((element) =>
      element._id.equals(item.subPackageId)
    );
    const rate = getRate(item.packageId, item.subPackageId);
    const amount = roundValue(item.quantity * rate);
    const taxAmount = roundValue(amount * (cart.service.taxPercentage / 100));
    const totalAmount = roundValue(amount + taxAmount);

    paymentSummary.itemAmount += amount;
    paymentSummary.taxAmount += taxAmount;
    paymentSummary.totalAmount += totalAmount;

    return {
      packageId: item.packageId?._id,
      packageName: item.packageId?.name,
      subPackageId: subPackage?._id ?? null,
      subPackageName: subPackage?.name ?? null,
      quantity: item.quantity,
      rate,
      amount,
      taxAmount,
      totalAmount,
    };
  });

  const payload = {
    cartId: cart._id,
    items,
    paymentSummary,
    tipOptions: [30, 50, 100],
  };

  sendResponse(res, 200, 'success', payload);
};

export const createOrder = async (req, res) => {
  const cartId = req.body.cartId;
  if (!cartId) return sendResponse(res, 400, 'cartId is required');

  const scheduledDate = dayjs(
    `${req.body.date} ${req.body.time}`,
    'DD/MM/YYYY HH:mm A'
  );

  if (!scheduledDate.isValid())
    return sendResponse(res, 400, 'Invalid date or time');

  const [cart, address] = await Promise.all([
    Cart.findOne({
      _id: cartId,
      user: req.user._id,
      isActive: true,
    })
      .populate('service')
      .populate('items.packageId')
      .lean(),
    Address.findOne({ _id: req.body.addressId, user: req.user._id }).lean(),
  ]);

  if (!cart) return sendResponse(res, 400, 'cart not found');
  if (!address) return sendResponse(res, 400, 'address not found');

  const paymentSummary = {
    itemAmount: 0,
    taxAmount: 0,
    tipAmount: req.body.tipAmount,
    totalAmount: req.body.tipAmount,
  };

  const items = cart.items.map((item) => {
    const subPackage = item.packageId.subPackages.find((element) =>
      element._id.equals(item.subPackageId)
    );
    const rate = getRate(item.packageId, item.subPackageId);
    const amount = roundValue(item.quantity * rate);
    const taxAmount = roundValue(amount * (cart.service.taxPercentage / 100));
    const totalAmount = roundValue(amount + taxAmount);

    paymentSummary.itemAmount += amount;
    paymentSummary.taxAmount += taxAmount;
    paymentSummary.totalAmount += totalAmount;

    return {
      packageId: item.packageId?._id,
      packageName: item.packageId?.name,
      subPackageId: subPackage?._id ?? null,
      subPackageName: subPackage?.name ?? null,
      quantity: item.quantity,
      rate,
      amount,
      taxAmount,
      totalAmount,
    };
  });

  const order = new Order({
    orderId: generateOrderId(),
    user: req.user._id,
    service: cart.service._id,
    cart: cart._id,
    address,
    scheduledDate: scheduledDate.toDate(),
    items,
    paymentSummary,
  });

  const payment = await createPaymentOrder({
    userId: req.user._id,
    amount: order.paymentSummary.totalAmount,
  });

  order.paymentSummary.history.push(payment._id);

  await order.save();

  sendResponse(res, 200, 'success', {
    id: order._id,
    orderId: payment.orderId,
    amount: payment.amount,
    key: process.env.RAZORPAY_KEY,
  });
};

export const confirmOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return sendResponse(res, 404, 'order not found');

  if (order.status !== OrderStatus.PENDING) {
    return sendResponse(res, 400, 'order is not in pending status');
  }

  const [errorMessage, payment] = await verifyPayment({
    userId: req.user._id,
    orderId: req.body.orderId,
    paymentId: req.body.paymentId,
    paymentSignature: req.body.paymentSignature,
  });

  if (errorMessage) return sendResponse(res, 400, errorMessage);

  order.placedAt = new Date();
  order.status = OrderStatus.PLACED;

  await order.save();

  sendResponse(res, 200, 'success', {
    id: order._id,
    orderId: order.orderId,
    amount: order.paymentSummary.totalAmount,
    paymentMethod: payment.method,
    invoiceId: '',
    invoiceUrl: '',
  });
};

export const getOrders = async (req, res) => {
  const filter = { user: req.user._id, status: { $ne: OrderStatus.PENDING } };
  const offset = parseInt(req.query.offset || 0);
  const limit = parseInt(req.query.limit || 50);

  if (req.query.orderId) {
    filter['orderId'] = new RegExp(req.query.orderId, 'i');
  }

  if (req.query.status) {
    filter['status'] = req.query.status;
  }

  if (req.query.service) {
    filter['service'] = req.query.service;
  }

  const data = await Order.find(filter)
    .populate('service')
    .skip(offset)
    .limit(limit)
    .lean()
    .sort({ createdAt: -1 });

  sendResponse(res, 200, 'success', data);
};

export const getOrderById = async (req, res) => {
  const data = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .lean()
    .populate('service')
    .populate('address');

  if (!data) return sendResponse(res, 404, 'order not found');

  sendResponse(res, 200, 'success', data);
};
