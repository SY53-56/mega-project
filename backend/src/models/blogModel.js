const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image:[ { type: String }], // optional: URL or path
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
    slug: { type: String, required: true, unique: true }, // ✅ add slug here
    like:[
      {type:mongoose.Schema.Types.ObjectId, ref:"User"}
    ],
  

  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Blog", blogSchema);
