import { sendResponse } from "../../../shared/utils/helper.js";
import userRouter from "./user.js";
import Router from "express";

const router = Router();

router.use("/user", userRouter);


router.use((req, res) => {
  sendResponse(res, 404, "Route Not Found", null, { path: req.path });
});

export default router;
