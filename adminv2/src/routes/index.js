import { sendResponse } from "../../../shared/utils/helper.js";
import superadminRouter from "./superadmin.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import inventoryRouter from "./inventory.js";
import tenantRouter from "./tenant.js";
import ownerRouter from "./owner.js";
import contractRouter from "./booking.js";
import adminServiceRouter from "./services.js"
import adminCategory from "./category.js"
import Router from "express";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();


router.use("/auth", authRouter);
router.use("/owners", checkAuth(), ownerRouter);
router.use("/properties",checkAuth(), inventoryRouter);
router.use("/tenants", checkAuth(), tenantRouter);
router.use("/contracts",checkAuth(), contractRouter);

router.use("/super-admin", checkAuth, superadminRouter);
router.use("/category",checkAuth, adminCategory);
router.use("/service",checkAuth, adminServiceRouter);

router.use("/", checkAuth, adminRouter);

router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
