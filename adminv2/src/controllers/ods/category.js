import dayjs from "dayjs";
import Category from "../../../../shared/models/category.js";

export const getCategory = async (req, res) => {
  const category = await Category.find({}).lean();
  return sendResponse(res, 200, "Categories Fetched SucccessFully", category);
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.categoryId,
  }).lean();
  return sendResponse(res, 200, "Category Fetched SucccessFully", category);
};

export const createCategory = async (req, res) => {
  try {
    const admin = req.user;
    const category = await Category.findOne({ name: req.body.name });
    if (category) {
      return sendResponse(res, 404, "Category Already Not Exist");
    }
    category.name = req.body.name;
    category.type = req.body.type;
    category.createdBy = admin;
    await category.save();
    return sendResponse(res, 200, "Category Created Successfully", category);
  } catch {
    throw {
      status: 500,
      message: "internal server error",
    };
  }
};

export const updateCategory = async (req, res) => {
  try {
    const admin = req.user;
    const category = await Category.findOne({ _id: req.body.categoryId });
    if (!category) {
      return sendResponse(res, 404, "category does not exist");
    }

    category.name = req.body.name;
    category.updatedAt = dayjs();
    category.save();

    return sendResponse(res, 200, "Category Updated Successfully", category);
  } catch {
    throw {
      status: 500,
      message: "internal server error",
    };
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const data = await Category.deleteOne({ _id: req.body.categoryId });
    return sendResponse(res, 200, "Success", data);
  } catch {
    throw {
      status: 500,
      message: "internal server error",
    };
  }
};
