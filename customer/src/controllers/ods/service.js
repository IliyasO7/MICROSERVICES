import Service from "../../../models/ods/service.js";

export const getServices = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["name"] = new RegExp(req.query.name, "i");
  }

  if (req.query.catalog) {
    filter["catalog"] = req.query.catalog;
  }

  if (req.query.category) {
    filter["category"] = req.query.category;
  }

  const data = await Service.find(filter).lean();

  sendResponse(res, 200, "success", data);
};

export const getServiceById = async (req, res) => {
  const data = await Service.findById(req.params.id)
    .lean()
    .populate("catalog")
    .populate("category");
  if (!data) return sendResponse(res, 404, "service not found");

  sendResponse(res, 200, "success", data);
};
