const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String }, // optional: URL or path
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to user
    tags: [{ type: String }], // optional tags/categories
    slug: { type: String, unique: true }, // optional for URL-friendly paths
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Blog", blogSchema);
