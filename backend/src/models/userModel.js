const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
 img:{type:String,required:true}
}, { timestamps: true });

// Export the model
module.exports = mongoose.model("User", userSchema);
