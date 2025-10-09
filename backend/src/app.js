const express = require("express")
const app= express()

app.use(express.json());

app.get("/sahul",(req,res)=>{
    res.send("hello world")
})


module.exports= app

