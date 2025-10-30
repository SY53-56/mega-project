const mongoose  = require("mongoose")

const reviewSchema= new mongoose.Schema({
    rating:{type:String},
    comment:{type:String},
    user:{type:mongoose.Schema.ObjectId,ref:"User",required:true},
    blog:{type:mongoose.Schema.ObjectId,ref:"Blog",required:true}
},  { timestamps: true })

module.exports= mongoose.model("Review" , reviewSchema)