import Admin from "../../../shared/models/admin.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../../../shared/utils/token.js";
import { sendResponse } from "../../../shared/utils/helper.js";

//register super Admin
export const register = async (req, res) => {
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);
  const adminExists = await Admin.findOne({ email: req.body.email });

  if (adminExists) {
    return sendResponse(res, 400, "Admin Already Exists");
  }

  const totalAdmins = await Admin.find({ role: req.body.role });
  let count = totalAdmins.length;
  count = count + 1;
  const sku = `HJ-${req.body.role}-${count}`;

  const data = await Admin.create({
    adminId: sku,
    username: req.body.username,
    role: req.body.role,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: encryptedPassword,
  });
  return sendResponse(res, 200, "Admin Registered Successfully", data);
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
