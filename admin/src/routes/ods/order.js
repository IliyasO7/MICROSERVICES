import { Router } from "express";
import * as controller from "../../controllers/ods/order.js";
import * as validation from "../../validation/ods/vendor.js";
import { validate } from "../../../../shared/utils/helper.js";

const router = Router();

router.route("/").get(controller.getOrders);
router
  .route("/:id")
  .get(controller.getOrderById)
  .patch(controller.updateOrder)
  .delete(controller.deleteOrder);

router
  .route("assignVendor/:id")
  .post(validate(validation.vendorID), controller);

export default router;
