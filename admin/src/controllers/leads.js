import Leads from "../../../shared/models/leads.js";
import { sendResponse } from "../../../shared/utils/helper.js";

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
