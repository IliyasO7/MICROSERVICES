import Category from "../../../shared/models/category.js";
import { sendResponse } from "../../../shared/utils/helper.js";

  
export const createCategory = async (req, res) => {
    try{
        let admin = req.user;
        let category = await Category.findOne({ name: req.body.name })
        if (category) {
            return sendResponse(res, 409, "the category with this name already exists");         
        }
      let categoryDetails  = await Category.create({
          name: req.body.name,
          type: req.body.type,
          createdBy: admin,
        })
        if(categoryDetails) sendResponse(res, 200, "Category Created Successfully", {categoryDetails});
    }
    catch{
        throw {
            status: 500,
            message:"internal server error"
        }   
    }
  }
  
  
  export const updateCategory = async (req, res) => {
    try{
            let admin = req.user;
            await Category.updateOne({ _id: req.params.categoryId }, {
                $set: {
                name: req.body.name,
                updatedAt: dayjs()
                }
            })
            let category = await Category.findOne({ _id: req.params.categoryId })
            if (!category) {
                return sendResponse(res, 409, "category does not exist");         
            }
            if(category) sendResponse(res, 200, "Category Updated Successfully", {category});
        }
    catch{
        throw {
            status: 500,
            message:"internal server error"
        }
    }    
  }
  
  
  export const deleteCategory = async (req, res) => {
    try{
         await Category.deleteOne({ _id: req.params.categoryId })
             sendResponse(res, 200, "Success",);
    }
    catch{
        throw {
            status: 500,
            message:"internal server error"
        }
    }    
  }
  
  export const getCategory = async (req, res) => {
    const category  = await Category.find({})
        if(category) sendResponse(res, 200, "Categories Fetched SucccessFully", {category});
};