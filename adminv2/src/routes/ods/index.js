import { Router } from "express";
import serviceRoutes from "./service.js";
import categoryRoutes from "./category.js";
import subCategoryRoutes from "./subcategory.js";
import vendorRoutes from "./vendor.js";

const router = Router();

router.use("/services", serviceRoutes);
router.use("/category", categoryRoutes);
//router.use("/sub-category", subCategoryRoutes);
router.use("/sub-category", subCategoryRoutes);
router.use("/vendors", vendorRoutes);

//router.use("");

export default router;
