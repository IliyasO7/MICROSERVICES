const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const PhoneNumber = require('awesome-phonenumber')

// Models
const Customer = require('../models/customer')

// Create customer
exports.create = async (params) => {
  try {

    // Check if customer already exists
    let customer = await Customer.findOne({ phone: params.phone })
    if (customer) {
      throw {
        status: 409,
        message: 'Customer already exists'
      }
    }

    // Format phone number
    let phone = new PhoneNumber(params.phone, params.country)
    if (!phone.isValid()) {
      throw {
        status: 400,
        message: 'Invalid phone number'
      }
    }

    // Create customer
    var createCustomer = new Customer({
      _id: mongoose.Types.ObjectId(),
      fname: params.fname,
      lname: params.lname,
      email: params.email,
      phone: phone.getNumber(),
      password: params.password,
      country: params.country
    })

    let create = await createCustomer.save()

    if (create) {
      return {
        customerId: create._id
      }
    } else {
      return false
    }

  } catch (err) {
    throw err
  }
}

// Check login
exports.checkLogin = async (email, password) => {
  try {

    let customer = await Customer.findOne({ email: email })

    if (!customer) {
      return false
    }

    // Verify password
    let verifyPassword = await bcrypt.compare(password, customer.password)

    if (verifyPassword) {
      return {
        result: true,
        customerId: customer._id
      }
    } else {
      return false
    }

  } catch (err) {
    throw err
  }
}

// Create login token
exports.createLoginToken = async (customerId, expiresIn = '12h') => {
  try {

    let customer = await this.profile(customerId)

    let token = await jwt.sign({ customerId: customerId, role: 'customer' }, process.env.JWT_KEY, { expiresIn: expiresIn })

    return token

  } catch (err) {
    throw err
  }
}

// Get customer profile
exports.profile = async (customerId) => {
  try {

    let customer = await Customer.findById(customerId).lean()

    if (!customer) {
      throw 'Customer not found'
    }
  
    return customer

  } catch (err) {
    throw err
  }
}

// Update customer password
exports.updatePassword = async (customerId, newPassword) => {
  try {

    let customer = await this.profile(customerId)

    // Hash password
    let encryptedPassword = await bcrypt.hash(newPassword, 10)

    // Update
    await Customer.updateOne({ _id: customerId }, {
      $set: {
        password: encryptedPassword
      }
    })

    return true

  } catch (err) {
    throw err
  }
}

// Add customer address
exports.addAddress = async (customerId, address, setDefault) => {
  try {

    let customer = await this.profile(customerId)

    // Format phone number
    let phone = new PhoneNumber(address.phone, 'IN')
    if (!phone.isValid()) {
      throw 'Invalid phone number'
    }

    // Create address ID
    let addressId = await mongoose.Types.ObjectId()

    // Add address
    await Customer.updateOne({ _id: customerId }, {
      $push: {
        addresses: {
          _id: addressId,
          default: false,
          fname: address.fname,
          lname: address.lname,
          phone: phone.getNumber(),
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          country: address.country
        }
      }
    })

    // Set default (If true)
    if (setDefault) {
      this.setDefaultAddress(customerId, addressId)
    }

    return true

  } catch (err) {
    throw err
  }
}

// Set default address
exports.setDefaultAddress = async (customerId, addressId) => {
  try {

    let customer = this.profile(customerId)

    // Remove current default address
    await Customer.updateOne({ _id: customerId, 'addresses.default': true }, {
      $set: {
        'addresses.$.default': false
      }
    })

    // Set default address
    await Customer.updateOne({ _id: customerId, 'addresses._id': addressId }, {
      $set: {
        'addresses.$.default': true
      }
    })

    return true

  } catch (err) {
    throw err
  }
}

// Delete address
exports.deleteAddress = async (customerId, addressId) => {
  try {

    let customer = await this.profile(customerId)

    // Delete address
    await Customer.updateOne({ _id: customerId }, {
      $pull: {
        addresses: {
          _id: addressId
        }
      }
    })

    return true

  } catch (err) {
    throw err
  }
}