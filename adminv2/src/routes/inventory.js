import * as controller from "../controllers/inventory.js"
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";
import multer from "multer"
const upload = multer({dest: 'uplaod/'})

const router = Router();

//logged in admin inventories
router
  .route('/') 
  .get(controller.getInventoryDetails)

//Inventories wrt owner mobile
router
  .route('/owner/:mobile') 
  .get(controller.getOwnerInventory)

//add property
router
  .route('/add/:ownerId') 
  .post(validate(validation.saveInventory), controller.saveInventory)

//update proerty images
router.post(
    "/:inventoryId/media", 
     upload.fields([{ name: 'mainImage'},    { name:'entranceImage' },
                   { name:'livingImage' },   { name:'kitchenImage'},
                   { name:'bedroomImage'}]), controller.updateArrayPropertyImages);
                 
//Inventory w.r.t inventoryId
router
  .route('/:inventoryId') 
  .get(controller.getInventorywithId)

//all inventory
router
  .route('/all-inventories') 
  .get(controller.getAllInventoryDetails)

export default router;