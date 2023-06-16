const { validationResult } = require('express-validator')

module.exports = async (req, res, next) => {
  
  const errors = validationResult(req)
  if (!errors.isEmpty(errors.array()[0])) {

    console.error(errors)

    return res.status(400).json({
      result: 'error',
      message: errors.array()[0].msg
    });

  } else {

    next()
    
  }
  
}