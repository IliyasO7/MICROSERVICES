import { sendResponse } from "../../../shared/utils/helper.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import inventoryRouter from "./inventory.js";
import tenantRouter from "./tenant.js";
import ownerRouter from "./owner.js";
import bookingRouter from "./booking.js";
import adminServiceRouter from "./services.js"
import adminCategory from "./category.js"
import Router from "express";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();


router.use("/auth", authRouter);
router.use("/tenant", checkAuth, tenantRouter);
router.use("/owner", checkAuth, ownerRouter);
router.use("/inventory",checkAuth, inventoryRouter);
router.use("/booking",checkAuth, bookingRouter);
router.use("/category",checkAuth, adminCategory);
router.use("/service",checkAuth, adminServiceRouter);

router.use("/", checkAuth, adminRouter);

router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
