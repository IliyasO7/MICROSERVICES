import Leads from "../../../shared/models/leads.js";
import { sendResponse } from "../../../shared/utils/helper.js";
import Service from "../../../shared/models/ods/service.js";

export const createZapierOdsLeads = async (req, res) => {
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
