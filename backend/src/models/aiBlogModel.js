const mongoose = require("mongoose");

const aiBlogSchema = new mongoose.Schema(
  { 
    author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
       },
    blogTitle: {              // ✅ ADD THIS
    type: String,
    required: true,
  },
    blogDescription:{
      type: String,
      required: true,
    },
    slug: {
      type: String,
      index:true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AiBlog", aiBlogSchema);