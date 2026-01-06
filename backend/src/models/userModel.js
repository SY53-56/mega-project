const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String, default: "https://via.placeholder.com/150" },
  bio: { type: String, default: "" },
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "User" }],

  saveBlog: [{ type: mongoose.Types.ObjectId, ref: "Blog" }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
