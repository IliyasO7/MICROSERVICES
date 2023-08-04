const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

// Middlewares
const auth = require('../middlewares/auth')

// Controllers
const blogController = require('../controllers/blogs')

// List
router.get(
    '/', 
    blogController.getBlogs
  )

  router.get(
    '/category/:categoryName',
    blogController.getBlogsByCategory
  )

  router.get(
    '/id/:id',
    blogController.getBlogsByID
  )

router.post(
    '/', 
    auth.isAdmin,
    blogController.createBlog
  )

router.patch(
    '/updateBlog', 
    auth.isAdmin,
    blogController.updateBlog
  )

router.delete(
  '/deleteBlog/:id',
  auth.isAdmin,
  blogController.deleteBlog
)

module.exports = router