const express = require("express")
const { getAllBlogs, postBlogData, updateBlogData,    deleteBlog, userAccount, getSingleBlog } = require("../controller/blogController")
const  userMiddleware  = require("../middleware/userMiddleware")
const checkBlogOwner = require("../middleware/checkBlogOwner")
const routes = express.Router()
const multer= require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary")

const storage =new CloudinaryStorage({
    cloudinary,
      params: {
    folder: "megablog_uploads", // folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
})

const uploads = multer({storage})
routes.get("/",getAllBlogs)
routes.get("/user/:id/",userMiddleware,userAccount)
routes.get("/:id", getSingleBlog)
routes.post("/", uploads.array("images",5),userMiddleware,postBlogData)
routes.put("/:id",userMiddleware,checkBlogOwner,updateBlogData)
routes.delete("/delete/:id",userMiddleware, checkBlogOwner,   deleteBlog)


module.exports =routes