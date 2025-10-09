const express = require("express")
const { userSignup, userLogin, userLogout } = require("../controller/userController")
const routes = express.Router()

routes.post("/signup", userSignup)
routes.post("/login",userLogin)
routes.get("/logout",userLogout)

module.exports = routes