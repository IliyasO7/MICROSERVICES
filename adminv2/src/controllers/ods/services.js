import Service from "../../../../shared/models/service.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
import _ from "lodash";

export const getServices = async (req, res) => {
  const services = await Service.find({}).lean();
  return sendResponse(res, 200, "Services Fetched SucccessFully", services);
};

export const getServiceById = async (req, res) => {
  const services = await Service.findOne({ _id: req.params.serviceId }).lean();
  return sendResponse(res, 200, "Services Fetched SucccessFully", services);
};

// Add service
export const createService = async (req, res, next) => {
  const service = await Service.findOne({ name: req.body.name });
  if (!service) {
    service.name = req.body.name;
    service.slug = _.kebabCase(req.body.name);
    service.category = req.body.categoryId;
    service.icon = req.body.icon;
    service.banners = req.body.banners;
    service.commission = req.body.commission;
    service.servicableCities = req.body.servicableCities;
    service.paymentModes = req.body.paymentModes;
    service.includedContent = req.body.includedContent;
    service.excludedContent = req.body.excludedContent;
    service.about = req.body.about;
    service.price = req.body.price;
    service.pageUrl1 = req.body.pageUrl1;
    service.pageUrl2 = req.body.pageUrl2;
    service.seo = req.body.seo;
    service.faqs = req.body.faqs;
    service.filters = req.body.filters;
    await service.save();

    return sendResponse(res, 200, "Services Created SucccessFully", service);
  }
  return sendResponse(res, 500, "Services Already Exists", service);
};
