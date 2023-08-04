import Router from "express";
import * as controller from "../controllers/webhook.js";

const router = Router();

router.route("/zapier/ods/lead").post(controller.createZapierOdsLeads);

export default router;
