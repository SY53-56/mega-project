const Blog= require("../models/blogModel")
const slugify=  require("slugify")
const {nanoid} = require("nanoid")
const User = require("../models/userModel")
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary")

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author","username img _id followers following"); // fetch all documents
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

    // Upload files
    const files = req.files || [];
    const uploaded = [];
    for (let f of files) {
      const result = await uploadBufferToCloudinary(f.buffer);
      uploaded.push(result.secure_url);
    }

    const blog = await Blog.create({
      title,
      description,
      image: uploaded,
      author: authorId,
      slug,
    });

    res.status(200).json({ success: true, blog });
  } catch (e) {
    console.error("Error in postBlogData:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};


const getSingleBlog=async(req,res)=>{
  try{
   const {id} = req.params

const blog = await Blog.findById(id).populate("author", "username img like followers following");
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
    const user = await User.findById(id).select("username email img _id saveBlog  followers bio following");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Fetch all blogs written by this user
    const blogs = await Blog.find({ author: id }).populate(
      "author",
      "username img _id  followers bio saveBlog following "
    );

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
    const { title, description, image } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Authorization
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this blog" });
    }

    // Update fields only if provided
    if (typeof title === "string") blog.title = title;
    if (typeof description === "string") blog.description = description;

    // Handle image safely
    if (Array.isArray(image)) {
      blog.image = image.filter(Boolean);
    } else if (typeof image === "string" && image.trim() !== "") {
      blog.image = [image];
    }

    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (e) {
    console.error("UpdateBlog error:", e);
    res.status(500).json({ success: false, message: "Server error" });
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
