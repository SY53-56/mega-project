const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    image: [{ type: String }],
    imagePublicId: [{ type: String }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    slug: { type: String, required: true, unique: true },

    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ author: 1 });
blogSchema.index({ slug: 1 });

module.exports = mongoose.model("Blog", blogSchema);
