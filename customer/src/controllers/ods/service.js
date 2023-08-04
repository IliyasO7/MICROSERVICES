import { ServiceCategory } from "../../../../shared/utils/constants.js";
import { sendResponse } from "../../../../shared/utils/helper.js";
import ServicePackage from "../../../../shared/models/ods/package.js";
import Service from "../../../../shared/models/ods/service.js";
import groupBy from "lodash/groupBy.js";

export const getServices = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["name"] = new RegExp(req.query.name, "i");
  }

  if (req.query.category) {
    filter["category"] = req.query.category;
  }

  const data = await Service.find(filter).lean();

  const payload = Object.values(ServiceCategory).reduce(
    (prev, name) => ({
      ...prev,
      [name]: [],
    }),
    {}
  );

  Object.assign(payload, groupBy(data, "category"));

  sendResponse(res, 200, "success", payload);
};

export const getServiceById = async (req, res) => {
  const data = await Service.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, "service not found");

  sendResponse(res, 200, "success", data);
};

export const getServicePackages = async (req, res) => {
  const data = await ServicePackage.find({ service: req.params.id }).lean();

  sendResponse(res, 200, "success", data);
};
