import { Router } from "express";
import * as controller from "../controllers/leads.js";

const router = Router();

router.route("/").get(controller.getAllLeads);

router
  .route("/:id")
  .get(controller.getLeadById)
  .patch(controller.updateLead)
  .delete(controller.deleteLead);

export default router;
