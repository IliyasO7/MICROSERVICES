import Admin from "../../../shared/models/admin.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { sendResponse } from "../../../shared/utils/helper.js";

export const createSuperAdmin = async (req, res) => {
  const username = req.body.username;
  const role = req.body.role;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;

  const encryptedPassword = await bcrypt.hash(password, 10);
  const adminExists = await Admin.findOne({ email: email });

  if (adminExists) {
    return sendResponse(res, 400, "Admin Already Exists");
  }

  const totalAdmins = await Admin.find({ role: "HJ-SUPER-ADMIN" });
  const count = totalAdmins.length;
  const currentAdminNo = count + 1;
  // let currentAdminNo =  1;
  const sku = `HJ-SUPER-ADMIN-${currentAdminNo}`;

  const data = await Admin.create({
    adminId: sku,
    username: username,
    role: `HJ-SUPER-ADMIN`,
    fname: fname,
    lname: lname,
    email: email,
    password: encryptedPassword,
  });
  if (saveUser)
    sendResponse(res, 200, "Super Admin Created Successfully", data);
};

export const loginAdmin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const adminData = await Admin.findOne({ username: username });

  if (!adminData) {
    return sendResponse(res, 400, "Admin Does Not Exists");
  } else {
    const verifyPassword = await bcrypt.compare(password, adminData.password);
    if (verifyPassword) {
      const tokens = generateTokens({ userId: adminData._id });
      return sendResponse(res, 200, "Admin Login Successfully", {
        tokens,
        adminData,
      });
    }
  }
};

export const createOdsAdmin = async (req, res) => {
  console.log("create ODS ADMIN");

  const superAdmin = req.user;
  const username = req.body.username;
  const role = req.body.role;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;

  const encryptedPassword = await bcrypt.hash(password, 10);
  const adminExists = await Admin.findOne({ email: email });

  if (adminExists) {
    return sendResponse(res, 400, "Admin Already Exists");
  }

  const totalAdmins = await Admin.find({ role: "HJ-ODS-ADMIN" });
  const count = totalAdmins.length;
  const currentAdminNo = count + 1;
  // let currentAdminNo =  1;
  const sku = `HJ-ODS-ADMIN-${currentAdminNo}`;

  const data = await Admin.create({
    adminId: sku,
    username: username,
    role: role,
    fname: fname,
    lname: lname,
    email: email,
    password: encryptedPassword,
    createdBy: superAdmin._id,
  });
  return sendResponse(res, 200, "Ods Admin Created Successfully", data);
};

export const createRentalAdmin = async (req, res) => {
  const superAdmin = req.user;
  const username = req.body.username;
  const role = req.body.role;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;

  const encryptedPassword = await bcrypt.hash(password, 10);
  const adminExists = await Admin.findOne({ email: email });

  if (adminExists) {
    return sendResponse(res, 400, "Admin Already Exists");
  }
  const totalAdmins = await Admin.find({ role: "HJ-RENTAL-ADMIN" });
  const count = totalAdmins.length;

  const currentAdminNo = count + 1;
  const sku = `HJ-RENTAL-ADMIN-${currentAdminNo}`;

  const data = await Admin.create({
    adminId: sku,
    username: username,
    role: `HJ-RENTAL-ADMIN`,
    fname: fname,
    lname: lname,
    email: email,
    password: encryptedPassword,
    createdBy: superAdmin._id,
  });
  return sendResponse(res, 200, "Rental Admin Created Successfully", data);
};
