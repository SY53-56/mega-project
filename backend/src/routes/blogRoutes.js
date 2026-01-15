const express = require("express")
const { getAllBlogs, postBlogData, updateBlogData,    deleteBlog, userAccount, getSingleBlog, likePostApi } = require("../controller/blogController")
const  userMiddleware  = require("../middleware/userMiddleware")
const checkBlogOwner = require("../middleware/checkBlogOwner")
const routes = express.Router()


const uploads = require("../middleware/uploadsImgMiddleware")





routes.get("/",getAllBlogs)
routes.get("/user/:id/",userMiddleware,userAccount)
routes.get("/:id", getSingleBlog)
routes.post("/", userMiddleware,uploads.array("images",5),postBlogData)
routes.put("/:id",userMiddleware,uploads.array("images",5),checkBlogOwner,updateBlogData)
routes.delete("/delete/:id",userMiddleware, checkBlogOwner,   deleteBlog)
routes.put("/like/:id", userMiddleware,likePostApi)

module.exports =routes