const Blog= require("../models/blogModel")
const slugify=  require("slugify")
const {nanoid} = require("nanoid")
const User = require("../models/userModel")
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary")
const cloudinary = require('../config/cloudinary')
const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page)||1
    const limit = Number(req.query.limit)||8
    const skip = (page-1)*limit

    const blogs = await Blog.find().select("title description image author like createdAt slug").populate("author","username image _id").sort({ createdAt: -1 }).limit(limit).skip(skip).lean(); // fetch all documents
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const postBlogData = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Title or description is empty" });

    const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    const authorId = req.user.id;

    const files = req.files || [];

    const uploaded = await Promise.all(
      files.map(async (file) => {
        if (!file.mimetype.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error("File too large, max 8MB");
        }

        const result = await uploadBufferToCloudinary(file.buffer);

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      })
    );

    const blog = await Blog.create({
      title,
      description,
      image: uploaded.map((img) => img.url),
      imagePublicId: uploaded.map((img) => img.publicId),
      author: authorId,
      slug,
    });

    res.status(201).json({ success: true, blog });
  } catch (e) {
    console.error("Error in postBlogData:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};



const getSingleBlog=async(req,res)=>{
  try{
   const {id} = req.params

const blog = await Blog.findById(id).select("title description image author like createdAt").populate("author", "username image like followers following").lean()
   res.status(201).json({success:true,blog})
 }catch(e){
console.log(e)
res.status(500).json({ success: false, message: e.message });
 }
}
// all post
const userAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch the user info first
    const user = await User.findById(id).select("username email image _id saveBlog  followers bio following").lean();
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Fetch all blogs written by this user
    const blogs = await Blog.find({ author: id }).select("title description image author like createdAt slug")
  .populate("author", "username image")
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .lean();

    // 3️⃣ Send both user + blogs in one response
    res.status(200).json({
      success: true,
      user,
      blog: blogs,
    });
  } catch (e) {
    console.error("userAccount error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};
const updateBlogData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Authorization
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;

    if (req.files && req.files.length > 0) {
  // Delete old images
  if (blog.imagePublicId?.length) {
    for (const publicId of blog.imagePublicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  // Upload new images
  const uploaded = await Promise.all(
    req.files.map(file => uploadBufferToCloudinary(file.buffer))
  );

  blog.image = uploaded.map(u => u.secure_url);
  blog.imagePublicId = uploaded.map(u => u.public_id);
}

    await blog.save();
    res.status(200).json({ success: true, blog });
  } catch (e) {
    console.error("UpdateBlog error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};



const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params; // blog ID from URL

    const deletedBlog = await Blog.findByIdAndDelete(id);
    


    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
 
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const likePostApi = async (req, res) => {
  try {
    const { id: blogId } = req.params; // blogId
    const userId = req.user.id; // string from JWT

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ Convert ObjectId to string before checking
    const hasLiked = blog.like.map((id) => id.toString()).includes(userId);

    if (hasLiked) {
      await Blog.findByIdAndUpdate(blog._id, { $pull: { like: userId } }, { new: true });
      return res.json({
        message: "Post unliked",
        liked: false,
      });
    } else {
      await Blog.findByIdAndUpdate(blog._id, { $addToSet: { like: userId } }, { new: true });
      return res.json({
        message: "Post liked",
        liked: true,
      });
    }
  } catch (e) {
    console.error("Like error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  getAllBlogs,
  postBlogData,
  userAccount,
  updateBlogData,
  deleteBlog,
  getSingleBlog,
  likePostApi
};
