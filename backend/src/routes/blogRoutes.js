const express = require("express")
const { getAllBlogs, postBlogData, updateBlogData,    deleteBlog, userAccount, getSingleBlog } = require("../controller/blogController")
const  userMiddleware  = require("../middleware/userMiddleware")
const checkBlogOwner = require("../middleware/checkBlogOwner")
const routes = express.Router()


const uploads = require("../middleware/uploadsImgMiddleware")




routes.get("/",getAllBlogs)
routes.get("/user/:id/",userMiddleware,userAccount)
routes.get("/:id", getSingleBlog)
routes.post("/", userMiddleware,uploads.array("images",5),postBlogData)
routes.put("/:id",userMiddleware,checkBlogOwner,updateBlogData)
routes.delete("/delete/:id",userMiddleware, checkBlogOwner,   deleteBlog)


module.exports =routes