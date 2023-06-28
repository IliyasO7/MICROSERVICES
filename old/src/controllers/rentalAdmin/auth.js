const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// Models
const rentalAdmin = require('../../models/rentalModel/rentaladmin')
const Admin = require('../../models/admin')


//Rental Admin signup
exports.createRentalAdmin = async (req, res, next) => {
    let rentalAdminMongooseId = mongoose.Types.ObjectId()
    let admin = await Admin.findOne({ username: req.body.username }).lean()
        // Hash password
        let encryptedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        const rental = await new rentalAdmin({
            _id: rentalAdminMongooseId,
            username: req.body.username,
            fname: 'rental',
            lname: 'admin',
            email: 'testadmin@housejoy.in',
            password: encryptedPassword,
        }).save()
        if(rental){
            res.status(200).json({
                result: 'success',
                data:rental
              })
        }
    
    } catch (err) {
      next(err)
    }
  }


// Admin login
exports.login = async (req, res, next) => {
  try {

    let rentaladmin = await rentalAdmin.findOne({ username: req.body.username }).lean()

    if (!rentaladmin) {
      throw {
        status: 409,
        message: 'Invalid credentials'
      }
    }

    // Verify password
    let verifyPassword = await bcrypt.compare(req.body.password, rentaladmin.password)

    if (!verifyPassword) {
      throw {
        status: 409,
        message: 'Invalid credentials'
      }
    }

    // Generate JWT Token
    let token = jwt.sign({ rentaladminId: rentaladmin._id, role: 'rentaladmin' }, process.env.JWT_KEY, { expiresIn: '24h' })

    res.status(200).json({
      result: 'success',
      token: token
    })

  } catch (err) {
    next(err)
  }
}


  /*
// Get profile
exports.profile = async (req, res, next) => {
  try {

    let admin = await Admin.findById(req.userData.adminId, '_id username fname lname phone status').lean()

    if (!admin) {
      throw {
        status: 404,
        message: 'Admin not found'
      }
    }

    res.status(200).json({
      result: 'success',
      profile: admin
    })

  } catch (err) {
    next(err)
  }
}

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {

    await Admin.updateOne({ _id: req.userData.adminId }, {
      $set: {
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
      }
    })

    res.status(200).json({
      result: 'success',
      message: 'profile updated successfully'
    })

  } catch (err) {
    next(err)
  }
}*/