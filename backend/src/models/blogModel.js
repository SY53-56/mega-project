const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: [
      {
        type: String, // cloudinary secure_url
      },
    ],

    imagePublicId: [
      {
        type: String, // cloudinary public_id
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index:true
    },

    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 }); // for sorting
blogSchema.index({ author: 1 });     // user blogs
blogSchema.index({ slug: 1 });  
module.exports = mongoose.model("Blog", blogSchema);
