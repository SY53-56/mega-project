const express = require("express")
const { getAllBlogs, postBlogData, updateBlogData,    deleteBlog } = require("../controller/blogController")
const { userMiddleware } = require("../middleware/userMiddleware")
const routes = express.Router()


routes.get("/",getAllBlogs)
routes.post("/blog",userMiddleware,postBlogData)
routes.put("/blog/:id",userMiddleware,updateBlogData)
routes.delete("/blog/delete/:id",userMiddleware,    deleteBlog)


module.exports =routes