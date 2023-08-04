import Router from "express";
import * as controller from "../controllers/dashboard.js";

const router = Router();

//logged in admin Booking
router.route("/").get(controller.getOverview);

export default router;
