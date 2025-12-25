const express = require("express")
const { userSignup, userLogin, userLogout, userData } = require("../controller/userController")
const routes = express.Router()

routes.post("/signup", userSignup)
routes.post("/login",userLogin)
routes.get("/logout",userLogout)
routes.get("/userAccount" , userData)
module.exports = routes