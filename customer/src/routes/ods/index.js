import { Router } from "express";
import categoryRoutes from "./category.js";
import serviceRoutes from "./service.js";
import cartRoutes from "./cart.js";
import orderRoutes from "./order.js";
import { checkAuth } from "../../middleware/checkAuth.js";

const router = Router();

router.use("/cart", checkAuth(), cartRoutes);
router.use("/orders", orderRoutes);
router.use("/services", serviceRoutes);
router.use("/categories", categoryRoutes);

export default router;
