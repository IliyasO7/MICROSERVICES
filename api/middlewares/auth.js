const jwt = require('jsonwebtoken')

// Check if customer is logged In
exports.isLoggedIn = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    next()
    
  } catch (err) {
    next({
      status: 401,
      message: 'Invalid authorization'
    })
  }
}

// Check if admin
exports.isAdmin = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    if (decoded.role == 'admin') {
      req.userData = decoded
      next()
    } else {
      throw new Error('You are not admin')
    }
    
  } catch (err) {
    next({
      status: 401,
      message: 'Invalid authorization'
    })
  }
}

// Check if vendor
exports.isVendor = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    if (decoded.role == 'vendor') {
      req.userData = decoded
      next()
    } else {
      throw new Error('You are not vendor')
    }
    
  } catch (err) {
    next({
      status: 401,
      message: 'Invalid authorization'
    })
  }
}