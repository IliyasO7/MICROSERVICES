const mongoose = require('mongoose')
const dayjs = require('dayjs')

// Models
const Category = require('../../models/category')

// Add category
exports.add = async (req, res, next) => {
  try {

    let category = await Category.findOne({ name: req.body.name })
    if (category) {
      throw {
        status: 409,
        message: 'the category with this name already exists'
      }
    }

    await new Category({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      type: req.body.type
    }).save()

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Update category
exports.update = async (req, res, next) => {
  try {

    await Category.updateOne({ _id: req.params.categoryId }, {
      $set: {
        name: req.body.name,
        updatedAt: dayjs()
      }
    })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}

// Delete category
exports.delete = async (req, res, next) => {
  try {

    await Category.deleteOne({ _id: req.params.categoryId })

    res.status(200).json({
      result: 'success'
    })

  } catch (err) {
    next(err)
  }
}