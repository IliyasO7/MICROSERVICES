import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import Cart from '../../../../shared/models/ods/cart.js';
import Order, { OrderStatus } from '../../../../shared/models/ods/order.js';
import Invoice, {
  InvoiceTaxType,
  InvoiceType,
} from '../../../../shared/models/invoice.js';
import {
  generateOrderId,
  getSequenceId,
  populateInvoice,
  roundValue,
  sendResponse,
} from '../../../../shared/utils/helper.js';
import Address from '../../../../shared/models/address.js';
import { razorpay } from '../../../../shared/services/razorpay.js';
import {
  createPaymentOrder,
  verifyPayment,
} from '../../../../shared/services/payu.js';
import Payment from '../../../../shared/models/payment.js';
import { CompanyDetail } from '../../../../shared/utils/constants.js';
import { CounterName } from '../../../../shared/models/counter.js';

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
    const rate = subPackage?.price || item.packageId.price;
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
    taxPercentage: 0,
    taxAmount: 0,
    tipAmount: req.body.tipAmount,
    totalAmount: req.body.tipAmount,
  };

  const items = cart.items.map((item) => {
    const subPackage = item.packageId.subPackages.find((element) =>
      element._id.equals(item.subPackageId)
    );
    const rate = subPackage?.price || item.packageId.price;
    const amount = roundValue(item.quantity * rate);
    const taxAmount = roundValue(amount * (cart.service.taxPercentage / 100));
    const totalAmount = roundValue(amount + taxAmount);

    paymentSummary.itemAmount += amount;
    paymentSummary.taxPercentage += cart.service.taxPercentage;
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
    name: req.user.fname,
    email: req.user.email,
    mobile: req.user.mobile,
    userId: req.user._id.toString(),
    product: 'ODS',
    amount: order.paymentSummary.totalAmount,
    callbackUrl: `${process.env.BASE_URL}/customer/ods/orders/${order._id}/confirm`,
    redirectUrl: `https://housejoygroup.com/account/bookings/${order._id}`,
  });

  order.paymentSummary.history.push(payment._id);

  await order.save();

  // sendResponse(res, 200, 'success', {
  //   id: order._id,
  //   orderId: payment.orderId,
  //   amount: payment.amount,
  //   key: process.env.RAZORPAY_KEY,
  // });

  sendResponse(res, 200, 'success', {
    orderId: order._id,
    amount: payment.amount,
    paymentUrl: payment.url,
  });
};

export const confirmOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.body.udf1,
  })
    .populate('address')
    .populate('user');
  if (!order) return sendResponse(res, 404, 'order not found');

  if (order.status !== OrderStatus.PENDING) {
    return sendResponse(res, 400, 'order is not in pending status');
  }

  const payment = await verifyPayment(req.body);
  if (!payment.success) return res.redirect(payment.redirectUrl);

  // const [errorMessage, payment] = await verifyPayment({
  //   userId: req.user._id,
  //   orderId: req.body.orderId,
  //   paymentId: req.body.paymentId,
  //   paymentSignature: req.body.paymentSignature,
  // });

  // if (errorMessage) return sendResponse(res, 400, errorMessage);

  const invoice = new Invoice({
    _id: await getSequenceId('HJINV-000', CounterName.INVOICE),
    type: InvoiceType.ODS,
    billFrom: {
      name: CompanyDetail.ODS.name,
      email: CompanyDetail.ODS.email,
      pan: CompanyDetail.ODS.pan,
      address: CompanyDetail.ODS.address,
      state: 'Karnataka',
    },
    billTo: {
      name: `${order.user.fname} ${order.user.lname}`,
      mobile: order.user.mobile,
      email: order.user.email,
      address: `${order.address.line1}, ${order.address.line2}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`,
      state: 'Karnataka',
    },
    items: order.items.map((item) => ({
      description: `${item.packageName}, ${item.subPackageName ?? ''}`,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    })),
    tax1Percentage: 0,
    tax2Percentage: 0,
    tax1Amount: 0,
    tax2Amount: 0,
    taxPercentage: order.paymentSummary.taxPercentage,
    taxAmount: order.paymentSummary.taxAmount,
    itemAmount: order.paymentSummary.itemAmount,
    totalAmount: order.paymentSummary.totalAmount,
  });

  if (order.paymentSummary.tipAmount) {
    invoice.items.push({
      description: 'Tip',
      quantity: 1,
      rate: order.paymentSummary.tipAmount,
      amount: order.paymentSummary.tipAmount,
    });
  }

  populateInvoice(invoice, invoice.billFrom.state === invoice.billTo.state);

  order.invoice = invoice._id;
  order.placedAt = new Date();
  order.status = OrderStatus.PLACED;

  await invoice.save();
  await order.save();

  if (order.cart) {
    Cart.updateOne({ _id: order.cart }, { isActive: false }).exec();
  }

  return res.redirect(payment.redirectUrl);

  // sendResponse(res, 200, 'success', {
  //   id: order._id,
  //   orderId: order.orderId,
  //   amount: order.paymentSummary.totalAmount,
  //   paymentMethod: 'none', // payment.method,
  //   invoiceId: invoice._id,
  //   invoiceUrl: `${process.env.BASE_URL}/invoice/${invoice._id}`,
  // });
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

  sendResponse(
    res,
    200,
    'success',
    Object.assign(data, {
      invoice: {
        id: data.invoice,
        url: `${process.env.BASE_URL}/invoice/${data.invoice}`,
      },
    })
  );
};
