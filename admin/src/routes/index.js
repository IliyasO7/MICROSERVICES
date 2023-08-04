import { sendResponse } from "../../../shared/utils/helper.js";
import superadminRouter from "./superadmin.js";
import authRouter from "./auth.js";
import dashBoardRouter from "./dashboard.js";
import propertyRouter from "./property.js";
import tenantRouter from "./tenant.js";
import ownerRouter from "./owner.js";
import contractRouter from "./contract..js";
import ods from "./ods/index.js";
import Router from "express";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

router.use("/ods", ods);
router.use("/auth", authRouter);
router.use("/dashboard", checkAuth(), dashBoardRouter);
router.use("/owners", checkAuth(), ownerRouter);
router.use("/properties", checkAuth(), propertyRouter);
router.use("/tenants", checkAuth(), tenantRouter);
router.use("/contracts", checkAuth(), contractRouter);
router.use("/super-admin", checkAuth(), superadminRouter);

router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
