import * as controller from "../controllers/admin.js";
import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";

const router = Router();


router.post('/create-super-admin',
validate(validation.adminCreate),
controller.createSuperAdmin);


router.post('/login',
validate(validation.adminlogin),
controller.loginAdmin);

router.post('/create-ods-admin',
checkAuthAdmin(),
validate(validation.adminCreate),
controller.createOdsAdmin);

router.post('/create-rental-admin',
checkAuthAdmin(),
validate(validation.adminCreate),
controller.createRentalAdmin);



//Get Tenant with number
router.get(
"/get-tenant/:mobile", 
checkAuthAdmin(),
controller.getTenant);


//Add Tenant
router.post(
"/create-tenant", 
checkAuthAdmin(),
validate(validation.saveUserTenant),
controller.createTenant);

//Add-Update Tenant in One API
router.post(
"/update-tenant", 
checkAuthAdmin(),
validate(validation.saveUserTenant),
controller.updateTenant);

//Add-Update Tenant in One API

router.post(
"/create-update-tenant", 
checkAuthAdmin(),
validate(validation.saveUserTenant),
controller.createAUpdateTenant);


//Get Owner with number
router.get(
"/get-owner/:mobile", 
checkAuthAdmin(),
controller.getOwner);

//Add Owner
router.post(
"/save-owner", 
checkAuthAdmin(),
validate(validation.saveUserOwner),
controller.createOwner);

//Update Owner
router.post(
"/update-owner", 
checkAuthAdmin(),
validate(validation.saveUserOwner),
controller.updateOwner);

//Get Admin Owner 
router.get(
"/get-admin-owner", 
checkAuthAdmin(),
controller.getAdminOwners);
    
//Get ALL Owner 
router.get(
"/get-all-owner", 
checkAuthAdmin(),
controller.getAllOwners);

//Add Owner with media
router.post(
"/owner/:ownerId/media", 
checkAuthAdmin(),
controller.updateMedia);
    
export default router;
