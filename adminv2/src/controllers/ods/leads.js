import Leads from "../../../models/ods/leads.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
import User from "../../../models/user.js";
//import Service from "../../../models/ods/service.js";
import Service from "../../../../shared/models/service.js";

export const createLeads = async (req, res) => {
  if (
    !req.body.full_name ||
    !req.body.phone_number ||
    !req.body.email ||
    !req.body.city ||
    !req.body.platform
  ) {
    return sendResponse(res, 400, "Parameters Required");
  }

  let service = await Service.findOne({
    name: req.body.types_of_service_,
  }).lean();

  if (!service) {
    service = await Service.findOne({
      _id: "63c94b6e9b197f413029fd33",
    }).lean();
  }

  const customerName = req.body.full_name;
  const phone = req.body.phone_number;
  const email = req.body.email;
  const city = req.body.city;
  const platform = req.body.platform;

  const data = new Leads({
    service: service,
    customerName: req.body.full_name,
    phone: req.body.phone_number,
    email: req.body.email,
    city: req.body.city,
    platform: req.body.platform,
    inspectionDate:
      req.body["when_would_you_prefer_the_inspection_to_take_place?"],
    remarks: [],
    time: "",
    status: "unread",
  });

  await data.save();
  return sendResponse(res, 200, "success", data);
};

export const getAllLeads = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["name"] = new RegExp(req.query.name, "i");
  }

  if (req.query.category) {
    filter["category"] = req.query.category;
  }

  let service = await Leads.find(filter).populate("service").lean();
  let data = [];
  for await (element of service) {
    data.push(element);
  }

  sendResponse(res, 200, "success", data);
};

export const getLeadById = async (req, res) => {
  const data = await Leads.findById(req.params.id).lean().populate("service");
  if (!data) return sendResponse(res, 404, "Leads not found");

  sendResponse(res, 200, "success", data);
};

export const updateLead = async (req, res) => {
  let toDb = {
    text: req.body.text,
    remarkTime: req.body.remarks.remarkTime,
  };
  const date = new Date();
  const lead = await Leads.findById(req.params.id).lean();

  let datas = await Leads.updateOne(
    { _id: req.params.id },
    { $push: { remarks: toDb } }
  );

  const updatedAt = await Leads.updateOne(
    { _id: req.body.id },
    { updatedAt: date, status: "read" }
  );

  return sendResponse(res, 200, "success");
};

export const deleteLead = async (req, res) => {
  const data = await Leads.findById(req.params.id);
  if (!data) return sendResponse(res, 404, "Leads not found");

  await data.deleteOne();

  sendResponse(res, 200, "success");
};

/*
export const createLeadOrder = async (req, res) => {
  let createCustomer = await User.findOne({
    mobile: req.body.address.phone,
  }).lean();

  createCustomer = await User.findOne({
    email: req.body.address.email,
  }).lean();

  if (!createCustomer) {
    let ID = mongoose.Types.ObjectId();
    createCustomer = await new Customer({
      fname: req.body.address.fname,
      lname: req.body.address.lname,
      email: req.body.address.email || "no@e.mail",
      phone: req.body.address.phone,
      password: req.body.address.password || "12345679",
      country: req.body.address.country || "in",
    }).save();

    console.log("cid", createCustomer);

    let addressId = await mongoose.Types.ObjectId();

    await Customer.updateOne(
      { _id: createCustomer._id },
      {
        $push: {
          addresses: {
            _id: addressId,
            fname: req.body.address.fname,
            lname: req.body.address.lname,
            phone: req.body.address.phone,
            address: req.body.address.address,
            city: req.body.address.city,
            state: req.body.address.state,
            pincode: req.body.address.pincode,
            country: req.body.address.country || "in",
          },
        },
      }
    );
  }

  // Service
  let service = await Service.findOne({ _id: req.body.serviceId }).lean();
  console.log("service", service);
  console.log("service id", service._id);
  if (!service) {
    throw new Error("Service not found");
  }

  let order = {
    orderId: undefined,
    isFinal: req.body.isFinal,
    service: {
      name: service.name,
      category: service.category,
      slug: service.slug,
      subLines: [],
    },
    amount: {
      subtotal: 0,
      taxes: [],
      total: 0,
    },
  };

  // Calculate subtotal prices
  order.amount.subtotal += service.price;

  // Add filters price to subtotal

  // Calculate total price
  order.amount.total =
    order.amount.subtotal + _.sumBy(order.amount.taxes, "amount");

  // If order is final
  if (req.body.isFinal) {
    let orderId = _.toUpper(randomstring.generate(7));
    let now = new Date();
    now = new Date(now.getTime() + 330 * 60000);
    let nowStr = now.toString();
    let nowDate = nowStr.substring(0, 15);
    let nowTime = nowStr.substring(16, 24);
    console.log("orderId", orderId);
    await new Order({
      _id: mongoose.Types.ObjectId(),
      orderId: orderId,
      customer: createCustomer._id,
      service: service._id,
      address: req.body.address,
      taxes: order.amount.taxes,
      "payment.amount": order.amount.total,
      serviceDate: req.body.serviceDate,
      serviceTime: req.body.serviceTime,
    }).save();

    order.orderId = orderId;

    // Send SMS
    await smsService.send({
      type: "TXN",
      senderId: "HSEJOY",
      templateId: "1107167223418440431",
      phone: createCustomer.phone,
      message: `Thank you for using HouseJoy Service! Your booking ID: ${orderId} is confirmed on ${nowDate}, ${nowTime}. Our professional partner will get back to you shortly.`,
    });
  }

  sendResponse(res, 200, "success");
};
*/
