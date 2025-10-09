const express = require("express")
const app= express()
const UserRoutes = require("./routes/UserRoutes")
const cookie = require("cookie-parser")
app.use(express.json());
app.use(cookie())
app.get("/sahul",(req,res)=>{
    res.send("hello world")
})
app.use("/user/",UserRoutes)

module.exports= app

