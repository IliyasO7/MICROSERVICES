import Lead from '../../../shared/models/lead.js';
import User from "../../../shared/models/user.js";
import Address from '../../../shared/models/address.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);
import Order, { OrderStatus } from '../../../../shared/models/ods/order.js';
import Service from '../../../shared/models/ods/service.js'

import {
  generateOrderId,
  roundValue,
  sendResponse,
} from '../../../../shared/utils/helper.js';



const getRate = (packageData, subPackageId = null) => {
  const subPackage = packageData.subPackages?.find((item) =>
    item._id.equals(subPackageId)
  );
  if (!subPackageId) return packageData.price;

  return subPackage.prices;
};


export const getLeads = async (req, res) => {
  const filter = {};
  const offset = parseInt(req.query.offset || 0);
  const limit = parseInt(req.query.limit || 100);

  if (req.query.name) {
    filter['customerInfo.name'] = new RegExp(req.query.name, 'i');
  }

  if (req.query.mobile) {
    filter['customerInfo.mobile'] = req.query.mobile;
  }

  if (req.query.type) {
    filter['type'] = req.query.type;
  }

  if (req.query.platform) {
    filter['platform'] = req.query.platform;
  }

  if (req.query.status) {
    filter['status'] = req.query.status;
  }

  if (req.query.serviceId) {
    filter['service'] = req.query.serviceId;
  }

  const data = await Lead.find(filter)
    .populate('service', 'name category')
    .lean()
    .skip(offset)
    .limit(limit);

  sendResponse(res, 200, 'success', data);
};

export const getLeadById = async (req, res) => {
  const data = await Lead.findById(req.params.id)
    .lean()
    .populate('service', 'name category');
  if (!data) return sendResponse(res, 404, 'Lead not found');

  sendResponse(res, 200, 'success', data);
};

export const updateLead = async (req, res) => {
  let toDb = {
    text: req.body.text,
    remarkTime: req.body.remarks.remarkTime,
  };
  const date = new Date();
  const lead = await Lead.findById(req.params.id).lean();

  let datas = await Leads.updateOne(
    { _id: req.params.id },
    { $push: { remarks: toDb } }
  );

  const updatedAt = await Lead.updateOne(
    { _id: req.body.id },
    { updatedAt: date, status: 'read' }
  );

  return sendResponse(res, 200, 'success');
};

export const deleteLead = async (req, res) => {
  const data = await Lead.findById(req.params.id);
  if (!data) return sendResponse(res, 404, 'Lead not found');

  await data.deleteOne();

  sendResponse(res, 200, 'success');
};


export const createLeadtoOrder = async (req, res) => {
  const data = await Lead.findById(req.params.id);
  const service = await Service.findById(data.service);
  if (!data) return sendResponse(res, 404, 'Lead not found');

  let user = await User.findOne({mobile: req.body.mobile});
  if(!user){
    user.fname = data.customerInfo.name;
    user.email = data.customerInfo.email;
    user.mobile = data.customerInfo.mobile;
    user.addedBy = req.user._id;
    await user.save();
  }

  let address = await Address.findOne({ user: user._id });
  if(!address){
    address.user = user._id;
    address.fname = data.customerInfo.name;
    address.lname = data.customerInfo.name;
    address.mobile = data.customerInfo.mobile;
    address.line1 = req.body.line1;
    address.line2 = req.body.line2;
    address.landmark = req.body.landmark;
    address.city = req.body.city;
    address.state = req.body.state;
    address.pincode = req.body.pincode;
    await address.save();
  }

  //add date and time quantity in joi
  const scheduledDate = dayjs(
    `${req.body.date} ${req.body.time}`,
    'DD/MM/YYYY HH:mm A'
  );
  
  if (!scheduledDate.isValid())
    return sendResponse(res, 400, 'Invalid date or time');

    const rate = await getRate(req.body.packageId, req.body.subPackageId);
    
    const amount = roundValue(req.body.quantity * rate);
    const taxAmount = roundValue(amount * (service.taxPercentage / 100));
    const totalAmount = roundValue(amount + taxAmount);

    const paymentSummary = {
      itemAmount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      tipAmount: req.body.tipAmount,
      totalAmount: req.body.tipAmount,
    };
  
    paymentSummary.itemAmount += amount;
    paymentSummary.taxAmount += taxAmount;
    paymentSummary.totalAmount += totalAmount;

    //pls verify this once
    let items = [];
    items.push(req.body.packageId)

    const order = new Order({
      orderId: generateOrderId(),
      user: user._id,
      service: service, 
      address,
      scheduledDate: scheduledDate.toDate(),
      items,
      paymentSummary,
    });

/*
   // Send SMS
   const nowDate= new Date();
   const nowTime  = date.getTime();
        await smsService.send({
          type: 'TXN',
          senderId: 'HSEJOY',
          templateId: '1107167223418440431',
          phone: req.body.mobile,
          message: `Thank you for using HouseJoy Service! Your booking ID: ${order.orderId} is confirmed on ${nowDate}, ${nowTime}. Our professional partner will get back to you shortly.`
        })
*/
  return sendResponse(res, 200, 'success', order);
};





