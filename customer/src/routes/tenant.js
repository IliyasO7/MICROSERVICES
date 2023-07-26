import { Router } from "express";
import * as controller from "../controllers/tenant/contract.js";
import * as validation from "../validation/profile.js";
import { validate } from "../../../shared/utils/helper.js";

const router = Router();

//logged in admin Booking
router.route("/contracts").get(controller.getContracts);

//booking with id
router.route("/contracts/:contractId").get(controller.getContractById);

router.route("/contracts/:contractId/payments").get(controller.getPayments);

//joi to be added
router
  .route("/contracts/:contractId/token-payment")
  .post(controller.tokenPayment);

//joi to be added
router
  .route("/contracts/:contractId/deposit-payment")
  .post(controller.depositPayment);

//joi to be added
router
  .route("/contracts/:contractId/rent-payment")
  .post(controller.rentPayment);

export default router;
