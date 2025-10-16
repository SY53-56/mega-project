const express = require("express")
const app= express()
const UserRoutes = require("./routes/UserRoutes")
const BlogRoutes =require("./routes/blogRoutes")
const cookie = require("cookie-parser")
const cors = require("cors")

app.use(express.json());
app.use(cookie())

app.use(cors({
  origin: "http://localhost:5173",   // your React app's address
  credentials: true                  // allows cookies / auth headers
}));
app.get("/sahul",(req,res)=>{
    res.send("hello world")
})
app.use("/user",UserRoutes)
app.use("/blog",BlogRoutes)

module.exports= app

