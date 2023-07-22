
import * as serviceController from "../controllers/services.js"
import Router from "express";
//import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";
import fs from "fs";
import multer from "multer"



const router = Router();

// List
router.get(
    '/',
     checkAuthAdmin(),
    serviceController.getServices
  )

/*
  // List
routers.get(
  '/',
   checkAuthAdmin(),
  serviceController.getServices
)*/

export default router;