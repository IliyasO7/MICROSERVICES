import * as controller from "../controllers/contract.js";
import Router from "express";

const router = Router();

router.route("/").get(controller.getAllContracts);

router.route("/:contractId").get(controller.getContractById);

export default router;
