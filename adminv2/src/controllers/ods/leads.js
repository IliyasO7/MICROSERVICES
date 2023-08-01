import Leads from "../../../models/ods/leads.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
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
