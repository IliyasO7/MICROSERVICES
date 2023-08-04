import { Router } from "express";
import * as controller from "../controllers/owner.js";
import * as validation from "../validation/owner.js";
import { validate, checkAuthAdmin } from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({ dest: "uplaod/" });

const router = Router();

router
  .route("/")
  .get(controller.getOwners) //done
  .post(validate(validation.createOwner), controller.createOwner); //done

router.route("/:id").get(controller.getOwnerById); //done

router.get("/:id/properties", controller.getOwnerProperties); //done

router.get("/:id/contracts", controller.getOwnerContracts); //done

router.post(
  "/:id/media",
  upload.fields([
    { name: "aadhar" },
    { name: "pan" },
    { name: "cancelledCheque" },
  ]),
  controller.updateOwnerMedia
); //done

export default router;
