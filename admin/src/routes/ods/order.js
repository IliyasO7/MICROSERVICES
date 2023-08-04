import { Router } from "express";
import * as controller from "../../controllers/ods/order.js";

const router = Router();

router.route("/").get(controller.getOrders);
router
  .route("/:id")
  .get(controller.getOrderById)
  .patch(controller.updateOrder)
  .delete(controller.deleteOrder);

/*
router
  .route("/:id")
  .get(controller.getOrderById)
  //  .patch(validate(validation.updateOrder), controller.updateOrder)
  .delete(controller.deleteOrder);
*/
export default router;
