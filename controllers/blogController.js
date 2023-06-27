const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

exports.getAllBlogs = async (req, res) => {
    try{
        const blogs = await blogModel.find({}).populate("user")
        if(!blogs){
            return res.status(200).send({
                message: "No blogs found",
                success: false
            })
        }
        return res.status(200).send({
            blogCount: blogs.length,
            message: "All blogs",
            success: true,
            blogs
        })
    }
    catch(err){
        return res.status(500).send({
            message: "Error getting all blogs",
            success: false,
            err
        })
    }
}

exports.createBlog = async (req, res) => {
    try{
        const { title, description, image, user } = req.body
        //validation
        if(!title || !description || !image || !user){
            return res.status(400).send({
                message: "Please provide all fields",
                success: false
            })
        }
        const existingUser = await userModel.findById(user);
        if(!existingUser){
            return res.status(404).send({
                message: "Unable to find user",
                success: false
            })
        }
        const newBlog = new blogModel({title, description, image, user})
        const session = await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({session})
        existingUser.blogs.push(newBlog)
        await existingUser.save({session})
        await session.commitTransaction()
        await newBlog.save()
        return res.status(201).send({
            message: "Blog created",
            success: true,
            newBlog
        })
    }
    catch(err){
        return res.status(400).send({
            message: "Error creating blog",
            success: false,
            err
        })
    }
}

exports.getBlog = async (req, res) => {
    try{
        const { id } = req.params
        const blog = await blogModel.findById(id)
        if(!blog){
            return res.status(404).send({
                message: "Blog not found",
                success: false
            })
        }
        return res.status(200).send({
            message: "Fetched single blog",
            success: true,
            blog
        })
    }
    catch(err){
        return res.status(500).send({
            message: "Error getting blog with id",
            success: false,
            err
        })
    }
}

exports.updateBlog = async (req, res) => {
    try{
        const { id } = req.params
        const { title, description, image} = req.body
        const blog = await blogModel.findByIdAndUpdate(id, {...req.body}, { new: true })
        return res.status(200).send({
            message: "Blog editted",
            success: true,
            blog
        })
    }
    catch(err){
        return res.status(400).send({
            message: "Error editting blog",
            success: false,
            err
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try{
        const { id } = req.params
        // const blog = await blogModel.findByIdAndDelete({"_id" : id}).populate("user")
        const blog = await blogModel.findByIdAndDelete(id).populate("user")
        await blog.user.blogs.pull(blog)
        await blog.user.save()
        return res.status(200).send({
            message: "Blog deleted",
            success: true,
            blog
        })
    }
    catch(err){
        return res.status(400).send({
            message: "Error deleting blog",
            success: false,
            err
        })
    }
}

exports.getUserBlogs = async (req, res) => {
    try{
        const { id } = req.params
        const userBlogs = await userModel.findById({"_id" : id}).populate("blogs")
        if(!userBlogs){
            return res.status(404).send({
                message: "Blogs not found for this user",
                success: false
            })
        }
        return res.status(200).send({
            blogCount: userBlogs.blogs.length,
            message: "User blogs",
            success: true,
            userBlogs
        })
    }
    catch(err){
        return res.status(400).send({
            message: "Error getting user blogs",
            success: false,
            err
        })
    }
}