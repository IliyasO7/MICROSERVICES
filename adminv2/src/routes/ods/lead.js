import { Router } from "express";
import * as controller from "../../controllers/ods/leads.js";
import * as validation from "../../validation/ods/leads.js";
import { validate } from "../../../../shared/utils/helper.js";

const router = Router();

router.route("/").get(controller.getAllLeads).post(controller.createLeads);

router
  .route("/:id")
  .get(controller.getLeadById)
  .patch(controller.updateLead)
  .delete(controller.deleteLead);

/*
router
  .route("/")
  .get(controller.getVendors)
  .post(validate(validation.createVendor), controller.createVendor);

router
  .route("/:id")
  .get(controller.getVendorById)
  .patch(validate(validation.updateVendor), controller.updateVendor)
  .delete(controller.deleteVendor);
*/
export default router;
