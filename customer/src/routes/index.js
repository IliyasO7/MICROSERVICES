import { sendResponse } from "../../../shared/utils/helper.js";
import authRoutes from "./auth.js";
import profileRoutes from "./profile.js";
import ownerRoutes from "./owner.js";
import tenantRoutes from "./tenant.js";

import Router from "express";
import { checkAuth } from "../middleware/checkAuth.js";
//import { checkAuth } from '../../../shared/utils/helper.js';

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", checkAuth(), profileRoutes);
router.use("/owner", checkAuth(), ownerRoutes);
router.use("/tenant", checkAuth(), tenantRoutes);

router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
