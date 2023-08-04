import * as controller from "../controllers/superadmin.js"
import Router from "express";
import validation from "../validation/admin.js";
import { validate} from "../../../shared/utils/helper.js";

const router = Router();

//create Rental admin
router
  .route('/create-rental-admin') 
  .post(validate(validation.adminCreate), controller.createRentalAdmin)


//create Ods admin
router
  .route('/create-ods-admin') 
  .post(validate(validation.adminCreate), controller.createOdsAdmin)

export default router;