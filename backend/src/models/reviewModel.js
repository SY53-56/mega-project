const mongoose  = require("mongoose")

const reviewSchema= new mongoose.Schema({
    rating:{type:String},
    comment:{type:String},
    author:{type:mongoose.Schema.ObjectId,ref:"User",required:true}
},  { timestamps: true })

module.exports= mongoose.model("Review" , reviewSchema)