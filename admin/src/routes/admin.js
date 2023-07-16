import * as controller from "../controllers/admin.js";

import Router from "express";
import validation from "../validation/admin.js";
import { validate,checkAuthAdmin } from "../../../shared/utils/helper.js";
//import { isLoggedIn } from "../utils/auth.js";
import fs from "fs";
import multer from "multer"
//const multer = require('multer')
const upload = multer({dest: 'uplaod/'})
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
upload.fields([
    {
      name: 'aadhar',
    },
    {
      name:'pan'
    },
    {
      name:'cancelledCheque'
    }
  ]),
controller.updateOwnerMedia);

//Add Inventory
router.post(
"/add-property/:ownerId", 
checkAuthAdmin(),
validate(validation.saveInventory),
controller.saveInventory);

router.post(
  "/property-images/:inventoryId/media", 
  checkAuthAdmin(),
  upload.fields([
      {
        name: 'mainImage',
      },
      {
        name:'entranceImage'
      },
      {
        name:'livingImage'
      },
      {
        name:'kitchenImage'
      },
      {
        name:'bedroomImage'
      }
    ]),
  controller.updatePropertyImages);


//Get All Inventories of logged in Admin
router.get(
"/get-admin-inventories", 
checkAuthAdmin(),
controller.getInventoryDetails);

//Get All Inventories of logged in Admin
router.get(
"/get-admin-inventories/:inventoryId", 
checkAuthAdmin(),
controller.getInventorywithId);
  
//Get All Inventories
router.get(
"/get-all-inventories", 
checkAuthAdmin(),
controller.getAllInventoryDetails);


//Get Owner Inventories
router.get(
"/get-owner-inventories/:mobile", 
checkAuthAdmin(),
controller.getOwnerInventory);

//Get All Bookings
router.get(
"/get-bookings", 
checkAuthAdmin(),
controller.getAllBookings);

//Get All Booking Details
router.get(
"/get-bookings/:bookingId", 
checkAuthAdmin(),
controller.getBookingDetails);
  
//Get All Tenants
router.get(
"/get-Tenants", 
checkAuthAdmin(),
controller.getAllTenants);

//Get All Tenants
router.get(
  "/get-all-owners", 
  checkAuthAdmin(),
  controller.getAllowners);

router.post('/create-category',
checkAuthAdmin(),
validate(validation.addCategory),
controller.createCategory);

router.post('/update-category/:categoryId',
checkAuthAdmin(),
validate(validation.updateCategory),
controller.updateCategory);


router.delete('remove-category/:categoryId',
checkAuthAdmin(),
controller.deleteCategory);


export default router;
