import * as controller from "../controllers/property.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate, checkAuthAdmin } from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({ dest: "uplaod/" });

const router = Router();

//add Property
router
  .route("/add/:ownerId")
  .post(validate(validation.saveInventory), controller.createProperty);

//logged in admin inventories
router.route("/").get(controller.getProperties);

//all property
router.route("/all").get(controller.getAllProperties);

//Property wrt owner mobile
router.route("/owner/:mobile").get(controller.getPropertyWithMobile);

//Propert w.r.t propertyId
router.route("/:propertyId").get(controller.getPropertyById);

//update proerty images
router.post(
  "/:propertyId/media",
  upload.fields([
    { name: "mainImage" },
    { name: "entranceImage" },
    { name: "livingImage" },
    { name: "kitchenImage" },
    { name: "bedroomImage" },
  ]),
  controller.updatePropertyImages
);

export default router;
