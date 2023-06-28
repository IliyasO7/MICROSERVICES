const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const Admin = require("../../models/admin");

// Admin login
exports.login = async (req, res, next) => {
  try {
    console.log("here");

    let admin = await Admin.findOne({ username: req.body.username }).lean();

    if (!admin) {
      throw {
        status: 409,
        message: "Invalid credentials",
      };
    }

    // Verify password
    let verifyPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!verifyPassword) {
      throw {
        status: 409,
        message: "Invalid credentials",
      };
    }

    // Generate JWT Token
    let token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      result: "success",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

// Get profile
exports.profile = async (req, res, next) => {
  try {
    let admin = await Admin.findById(
      req.userData.adminId,
      "_id username fname lname phone status"
    ).lean();

    if (!admin) {
      throw {
        status: 404,
        message: "Admin not found",
      };
    }

    res.status(200).json({
      result: "success",
      profile: admin,
    });
  } catch (err) {
    next(err);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    await Admin.updateOne(
      { _id: req.userData.adminId },
      {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
          username: req.body.username,
          email: req.body.email,
          password: await bcrypt.hash(req.body.password, 10),
        },
      }
    );

    res.status(200).json({
      result: "success",
      message: "profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
