const express = require('express')
const { getAllBlogs, createBlog, getBlog, updateBlog, deleteBlog, getUserBlogs } = require('../controllers/blogController')

//router object
const router = express.Router()

//routes
router.get('/all-blogs', getAllBlogs)
router.post('/create-blog', createBlog)
router.get('/get-blog/:id', getBlog)
router.put('/update-blog/:id', updateBlog)
router.delete('/delete-blog/:id', deleteBlog)
router.get('/user-blogs/:id', getUserBlogs)

module.exports = router