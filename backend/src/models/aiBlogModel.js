const mongoose = require("mongoose");

const aiBlogSchema = new mongoose.Schema(
  { 
    author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
       },
    blogTitle: {
      type: String,
      required: true,
      unique: true,
    },
    blogDescription:{
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AiBlog", aiBlogSchema);