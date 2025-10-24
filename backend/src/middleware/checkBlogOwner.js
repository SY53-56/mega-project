const Blog = require("../models/blogModel");

// Check if logged-in user is the blog owner
const checkBlogOwner = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to modify this blog" });
    }

    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkBlogOwner;
