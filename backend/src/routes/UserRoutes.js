const express = require("express")
const { userSignup, userLogin, userLogout, userData, follower, getFollowerData, saveBlog } = require("../controller/userController")
const userMiddleware = require("../middleware/userMiddleware")
const uploads = require("../middleware/uploadsImgMiddleware")
const routes = express.Router()

routes.post("/signup",uploads.single("image"), userSignup)
routes.post("/login",userLogin)
routes.get("/logout",userLogout)
routes.get("/userAccount" , userData)
routes.put("/follow/:id" ,userMiddleware, follower)
routes.get("/folowerAccount/:id" , userMiddleware , getFollowerData)
routes.put("/saveBlog/:id", userMiddleware , saveBlog)
module.exports = routes