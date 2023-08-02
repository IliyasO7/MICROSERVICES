import { Router } from "express";
import serviceRoutes from "./service.js";
import categoryRoutes from "./category.js";
import catalogRoutes from "./catalog.js";
import vendorRoutes from "./vendor.js";
import leadRoutes from "./vendor.js";
import orderRoutes from "./order.js";

const router = Router();

router.use("/services", serviceRoutes);
router.use("/category", categoryRoutes);
router.use("/catalog", catalogRoutes);
router.use("/vendors", vendorRoutes);
router.use("/orders", orderRoutes);
router.use("/leads", leadRoutes);

//router.use("");

export default router;
