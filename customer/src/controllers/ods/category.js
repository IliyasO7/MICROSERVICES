import Category from "../../../../shared/models/ods/category.js";
import { sendResponse } from "../../../../shared/utils/helper.js";

export const getCategories = async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter["name"] = new RegExp(req.query.name, "i");
  }

  if (req.query.isEnabled) {
    filter["isEnabled"] = req.query.isEnabled;
  }

  const data = await Category.find(filter).lean();

  sendResponse(res, 200, "success", data);
};

export const getCategoryById = async (req, res) => {
  const data = await Category.findById(req.params.id).lean();
  if (!data) return sendResponse(res, 404, "category not found");

  sendResponse(res, 200, "success", data);
};
