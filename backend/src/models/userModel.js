const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
 img:{type:String,default: "https://www.bing.com/ck/a?!&&p=c1ab54d0eb29f97155ba30efa490753af57933d5ec176cf023a09657a88f2fcaJmltdHM9MTc2NjAxNjAwMA&ptn=3&ver=2&hsh=4&fclid=3ca851ff-5f83-60e4-396d-47fe5e8561a7&u=a1L2ltYWdlcy9zZWFyY2g_cT1uYXR1cmUrd2FsbHBhcGVyJmlkPTM5QTEzNEREQTdDRDU5RTFCNTczQTEwQzQwRkQwM0JDRjMzOUNEMDgmRk9STT1JUUZSQkE"},
 like:{type:mongoose.Types.ObjectId, ref:"blog"},
 bio:{type:String , required:true},
 follower:[{type:mongoose.Types.ObjectId, ref:"User"}],
 follwing:{type:mongoose.Types.ObjectId, ref:"User"},
saveBlog:[{type:mongoose.Types.ObjectId, ref:"Blog"}]
}, { timestamps: true });

// Export the model
module.exports = mongoose.model("User", userSchema);
