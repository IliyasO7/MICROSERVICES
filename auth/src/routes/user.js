import * as controller from "../controllers/user.js";
import Router from "express";
import validation from "../validation/user.js";
import { checkAuth, validate ,checkAuthAdmin} from "../../../shared/utils/helper.js";
import multer from "multer";
const upload = multer({dest: 'uplaod/'})

const router = Router();

router.post("/send-otp", validate(validation.sendOtp), controller.sendOtp);
router.post(
  "/verify-otp",
  validate(validation.verifYOtp),
  controller.verifyOtp
);

router.post(
  "/tenant/update-kyc",
  checkAuth(),
  upload.fields([
    {
      name: 'aadhar',
    },
    {
      name:'pan'
    },
  ]),
  controller.verifyKyc
);

router.post(
  "/tenant/update-aadharPan",
  checkAuth(),
  validate(validation.verifyKyc),
  controller.updateTenantAddharPan
);

// Signup
router.post(
  "/register",
  checkAuth(),
  validate(validation.updateProfile),
  controller.updateProfile
);

// Get profile
router.get(
  "/profile",
  checkAuth(),
  controller.getprofile
);

// Get Owner Property wrt to owner login
router.get(
  "/get-user-owner-properties",
  checkAuth(),
  controller.getOwnerloggedInInventoryCounts
);

// Get Owner Property wrt to owner login
router.get(
  "/get-user-owner-allpropertyData",
  checkAuth(),
  controller.getOwnerloggedInInventoryData
);


// Add Address
router.post(
  "/addAddress",
  checkAuth(),
  validate(validation.address),
  controller.addAddress
);

//Update Address
router.post(
  "/updateAddress",
  checkAuth(),
  validate(validation.address),
  controller.updateAddress
);

//get User Address
router.get(
  "/getAddress",
  checkAuth(),
  controller.getAddress
);

// Set default address
router.post(
  '/setdefaultAddress',
  checkAuth(),
  validate(validation.setDefault),
  controller.setDefaultAddress
)

//Delete address
router.delete(
  '/deleteAddress/:addressId',
  checkAuth(),
  controller.deleteAddress
)

//Update User Role
router.post(
  '/update-role',
  checkAuth(),
  validate(validation.userRoles),
  controller.userRoleUpdate
)

//add Bank Details
router.post(
  "/bank-details", 
  checkAuth(),
  validate(validation.bankInfo),
  controller.addBankDetails); 

//update Bank Details
router.post(
  "/update-bank-details", 
  checkAuth(),
  validate(validation.bankInfo),
  controller.updateBankDetails);

//get Bank Details
 router.get(
  "/get-bank-details", 
  checkAuth(),
  controller.getBankDetails);

//add Uid And Pan Number
router.post(
  "/uid-details", 
  checkAuth(),
  validate(validation.uid),
  controller.addUid);

//get Uid
router.get(
  "/uid-details", 
  checkAuth(),
  controller.getUidDetails);

//Add Owner
router.post(
  "/save-owner", 
  checkAuthAdmin(),
  validate(validation.saveOwner),
  controller.saveOwner);

//Add Inventory
router.post(
  "/addProperty/:ownerId", 
  checkAuthAdmin(),
  validate(validation.saveInventory),
  controller.saveInventory);

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


//Get Owner Inventories AUTH
router.get(
  "/get-owner-inventory", 
  checkAuth(),
  controller.getOwnerInventoryList);

//Get Owner Inventory with id AUTH
router.get(
  "/get-owner-inventory/:inventoryId", 
  checkAuth(),
  controller.getOwnerInventoryDetails);

//Add Tenant
router.post(
  "/save-tenant", 
  checkAuthAdmin(),
  validate(validation.saveTenant),
  controller.saveTenant);

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



// tenant after login 
//Get All Booking Details for Token
router.get(
  "/get-tenant-booking", 
  checkAuth(),
  controller.getTenantBookingDetails);








export default router;
