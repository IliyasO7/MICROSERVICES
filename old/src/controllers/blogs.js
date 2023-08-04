const mongoose = require('mongoose')
const axios = require('axios')
const randomstring = require('randomstring')
const _ = require('lodash');

// Models
const Blogs = require('../models/blog')

exports.getBlogs = async (req, res, next) => {
    try {
        let blog = await Blogs.find({}).lean()

        res.json({
          result: 'success',
          blogCount: blog.length,
          blog : blog
        })
    }
    catch (err) {
        next(err)
    }
}

exports.getBlogsByCategory = async (req, res, next) => {
    try {
        let blog = await Blogs.find({ category: req.params.categoryName }).lean()

        res.json({
          result: 'success',
          blog : blog
        })
    }
    catch (err) {
        next(err)
    }
}

exports.getBlogsByID = async (req, res, next) => {
    try {
        let blog = await Blogs.find({ _id: req.params.id }).lean()

        res.json({
          result: 'success',
          blog : blog
        })
    }
    catch (err) {
        next(err)
    }
}


exports.createBlog = async (req, res, next) => {
    // console.log(req.params.formId);
    // console.log(req.body.__submission.id);
    try {

        let ID = mongoose.Types.ObjectId()
    
        await new Blogs({
            _id: ID,
            title: req.body.title,
            subTitle: req.body.subTitle,
            body: req.body.body,
            tags: req.body.tags,
            category: req.body.category
          }).save()

        console.log("what is happening here");
    
        res.json({
            result: "Blog Created"
        })
    
      } catch (err) {
        next(err)
      }   
  }

exports.updateBlog = async (req, res, next) => {
    try {
        let toDb = {}
        
        toDb = {$set: {
            title: req.body.title,
            subTitle: req.body.subTitle,
            body: req.body.body,
            category: req.body.category 
          }
        }

        await Blogs.updateOne({_id: req.body.id}, toDb)
        res.json({
            result: "Blog updated succefully"
        })
    }
    catch (err) {
        next(err)
    }
  }


  exports.deleteBlog = async (req, res, next) => {
    try {
        let toDb = {}
        
        toDb = {$set: {
            archived: true
          }
        }

        await Blogs.updateOne({_id: req.params.id}, toDb)
        res.json({
            result: "Blog deleted succefully"
        })
    }
    catch (err) {
        next(err)
    }
  }