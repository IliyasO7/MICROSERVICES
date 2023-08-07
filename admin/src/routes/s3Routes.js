import Router from "express";
import * as controller from "../controllers/s3.js";

const router = Router();

router.get("/", controller.getS3PresignedUrl);

export default router;
