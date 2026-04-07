const express = require("express")
const userMiddleware = require("../middleware/userMiddleware")
const { generateAiBlog, getaiBlogPost } = require("../controller/aiBlogController")
const routes = express.Router()


routes.post("/ai/generate", userMiddleware, generateAiBlog)
routes.get("/ai/:id",userMiddleware,getaiBlogPost)

module.exports =routes