const express = require("express")
const { getAllBlogs, postBlogData, updateBlogData,    deleteBlog } = require("../controller/blogController")
const { userMiddleware } = require("../middleware/userMiddleware")
const routes = express.Router()


routes.get("/",getAllBlogs)
routes.post("/",userMiddleware,postBlogData)
routes.put("/:id",userMiddleware,updateBlogData)
routes.delete("/delete/:id",userMiddleware,    deleteBlog)


module.exports =routes