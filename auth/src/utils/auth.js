//const jwt = require('jsonwebtoken')
import jwt from 'jsonwebtoken';

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

