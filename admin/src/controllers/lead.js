import Lead from '../../../shared/models/lead.js';
import { sendResponse } from '../../../shared/utils/helper.js';

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
