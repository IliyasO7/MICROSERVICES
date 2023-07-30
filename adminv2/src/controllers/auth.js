import Admin from "../../../shared/models/admin.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { sendResponse } from "../../../shared/utils/helper.js";

export const register = async (req, res) => {
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

export const login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const admin = await Admin.findOne({ username: username });

  if (!admin) {
    return sendResponse(res, 400, "Admin Does Not Exist");
  }

  const verifyPassword = await bcrypt.compare(password, admin.password);
  if (!verifyPassword) return sendResponse(res, 400, "Invalid credentials");

  const tokens = generateTokens({ userId: admin._id });

  sendResponse(res, 200, "Admin Login Successfully", {
    accessToken: tokens.accessToken,
    profile: admin,
  });
};
