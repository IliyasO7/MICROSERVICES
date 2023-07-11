import { sendResponse } from "../../../shared/utils/helper.js";
import adminRouter from "./admin.js";
import Router from "express";

const router = Router();

router.use("/", adminRouter);

router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
