const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "uplaods/" });

// Middlewares
const auth = require("../../middlewares/auth");
const checkValidation = require("../../middlewares/checkValidation");

// Controllers
const vendorController = require("../../controllers/admin/vendor");

// List
router.get("/", auth.isAdmin, vendorController.list);

// Add vendor
router.post(
  "/",
  auth.isAdmin,
  [
    body("ownerName").notEmpty().withMessage("Owner name is required"),
    body("phone").trim().notEmpty().withMessage("Invalid phone number"),
    body("additionalPhone")
      .trim()
      .notEmpty()
      .withMessage("Invalid additional mobile number"),
    body("password").notEmpty().withMessage("Invalid password"),
    body("homeAddress").notEmpty().withMessage("Invalid addresses"),
    body("businessName").notEmpty().withMessage("Invalid business name"),
    body("officeAddress").optional({ nullable: true }),
    body("serviceProvided").notEmpty().withMessage("Invalid service provided"),
    body("teamSize").notEmpty().withMessage("Invalid team size"),
    body("inBusinessSince").notEmpty().withMessage("Invalid Business years"),
    body("languagesKnown").notEmpty().withMessage("Invalid language known"),
    body("serviceArea").notEmpty().withMessage("Invalid service area"),
    body("aadharCardNumber")
      .notEmpty()
      .withMessage("Invalid aadhar card number"),
    body("bankAccountNumber")
      .notEmpty()
      .withMessage("Invalid bank account number"),
    body("bankIfscCode").notEmpty().withMessage("Invalid IFSC"),
    body("paymentReceiptNumber")
      .notEmpty()
      .withMessage("Invalid payment receipt number"),
  ],
  checkValidation,
  vendorController.create
);

router.post("/newVendors", vendorController.testVendor);

// Update vendor media
router.post(
  "/:vendorId/media",
  auth.isAdmin,
  upload.fields([
    {
      name: "aadhar",
      maxCount: 1,
    },
    {
      name: "bankDocument",
      maxCount: 1,
    },
    {
      name: "gstDocumentUpload",
      maxCount: 1,
    },
    {
      name: "agreementUpload",
      maxCount: 1,
    },
    {
      name: "paymentReceipt",
      maxCount: 1,
    },
  ]),
  vendorController.updateMedia
);

// Get vendor profile
router.get("/:vendorId", auth.isAdmin, vendorController.profile);

// Update vendor
router.post(
  "/:vendorId",
  auth.isAdmin,

  [
    body("ownerName").notEmpty().withMessage("Owner name is required"),
    body("phone")
      .isNumeric()
      .withMessage("Hell")
      .notEmpty()
      .withMessage("Invalid phone number"),
    body("additionalPhone")
      .isNumeric()
      .notEmpty()
      .withMessage("Invalid additional mobile number"),
    body("homeAddress").notEmpty().withMessage("Invalid addresses"),
    body("businessName").notEmpty().withMessage("Invalid business name"),
    body("officeAddress").optional({ nullable: true }),
    body("serviceProvided").notEmpty().withMessage("Invalid service provided"),
    body("teamSize").notEmpty().withMessage("Invalid team size"),
    body("inBusinessSince").notEmpty().withMessage("Invalid Business years"),
    body("languagesKnown").notEmpty().withMessage("Invalid language known"),
    body("serviceArea").notEmpty().withMessage("Invalid service area"),
    body("aadharCardNumber")
      .notEmpty()
      .withMessage("Invalid aadhar card number"),
    body("bankAccountNumber")
      .notEmpty()
      .withMessage("Invalid bank account number"),
    body("bankIfscCode").notEmpty().withMessage("Invalid IFSC"),
    body("paymentReceiptNumber")
      .notEmpty()
      .withMessage("Invalid payment receipt number"),
  ],
  checkValidation,
  vendorController.update
);

// Delete vendor
router.delete("/:vendorId", auth.isAdmin, vendorController.delete);

module.exports = router;
