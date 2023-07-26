import * as controller from "../controllers/owner.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate, checkAuthAdmin } from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({ dest: "uplaod/" });

const router = Router();

//create and update owners
router
  .route("/")
  .get(controller.getAdminOwners)
  .post(validate(validation.saveUserOwner), controller.createOwner);
//.patch(validate(validation.saveUserOwner), controller.updateOwner);

//get owner with mobile
router.route("/:mobile").get(controller.getOwner);

//get All Owners
router.route("/all-owners").get(controller.getAdminOwners);

//add Owner with media
router.post(
  "/:ownerId/media",
  upload.fields([
    { name: "aadhar" },
    { name: "pan" },
    { name: "cancelledCheque" },
  ]),
  controller.updateOwnerMedia
);

export default router;
