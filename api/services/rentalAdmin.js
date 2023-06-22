const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const PhoneNumber = require('awesome-phonenumber')
const randomstring = require('randomstring')

// Model
const Vendor = require('../models/vendor')



// Check login
exports.checkLogin = async (phone, password) => {
  try {

    let vendor = await Vendor.findOne({ phone: phone }).lean()

    if (!vendor) {
      throw new Error('Vendor not found')
    }

    // Verify password
    let verifyPassword = await bcrypt.compare(password, vendor.password)

    if (verifyPassword) {
      return {
        result: true,
        vendorId: vendor._id
      }
    } else {
      return false
    }

  } catch (err) {
    throw err
  }
}

// Create login token
exports.createLoginToken = async (vendorId, expiresIn = '24h') => {
  try {
    console.log('EXPIRES IN',expiresIn);

    let vendor = await this.profile(vendorId)

    let token = await jwt.sign({ vendorId: vId, role: 'rentalAdmin' }, process.env.JWT_KEY, { expiresIn: expiresIn })

    return token

  } catch (err) {
    throw err
  }
}

// Get vendor profile
exports.profile = async (vendorId) => {
  try {

    let vendor = await Vendor.findOne({ _id: vendorId }).lean()

    if (!vendor) {
      throw 'Vendor not found'
    }
  
    return vendor

  } catch (err) {
    throw err
  }
}

// Update vendor password
exports.updatePassword = async (vendorId, newPassword) => {
  try {

    let vendor = await this.profile(vendorId)

    // Hash password
    let encryptedPassword = await bcrypt.hash(newPassword, 10)

    // Update
    await Vendor.updateOne({ _id: vendorId }, {
      $set: {
        password: encryptedPassword
      }
    })

    return true

  } catch (err) {
    throw err
  }
}