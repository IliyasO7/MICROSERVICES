import { Router } from "express";
import * as controller from "../controllers/owner/contract.js";
import * as validation from "../validation/profile.js";
import { validate } from "../../../shared/utils/helper.js";

const router = Router();

//logged in admin Booking
router.route("/contracts").get(controller.getContracts);

//booking with id
router.route("/contracts/:contractId").get(controller.getContractById);

//
router.route("/contracts/:contractId/payments").get(controller.getPayments);

export default router;
