const Blog= require("../models/blogModel")
const slugify=  require("slugify")
const {nanoid} = require("nanoid")
const User = require("../models/userModel")
const Review =require("../models/reviewModel")
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author","username img _id"); // fetch all documents
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

const blog = await Blog.findById(id).populate("author", "username");
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
    const user = await User.findById(id).select("username email img _id");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Fetch all blogs written by this user
    const blogs = await Blog.find({ author: id }).populate(
      "author",
      "username img _id"
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
    const updates = req.body;

  
    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: updatedBlog });
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
    console.error(err);
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
};
