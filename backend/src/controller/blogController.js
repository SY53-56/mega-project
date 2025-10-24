const Blog= require("../models/blogModel")
const slugify=  require("slugify")
const {nanoid} = require("nanoid")

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
    const { title, description, image } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Title or description is empty" });

    const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    const authorId = req.user.id;

    console.log("Request body:", req.body);
    console.log("Author from middleware:", req.user);

    const blog = await Blog.create({
      title,
      description,
      image,
      author: authorId,
      slug, // ✅ include slug here
    });

    res.status(200).json({ success: true, blog });
  } catch (e) {
    console.log(e);
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
const userAccount= async(req ,res)=>{
 try{
   const {id} = req.params

const blog = await Blog.find({author:id}).populate("author", "username");
   res.status(201).json({success:true,blog})
 }catch(e){
console.log(e)
 }
}
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



module.exports= {
    getAllBlogs,
    postBlogData,
    userAccount,
    updateBlogData,
    deleteBlog,
    getSingleBlog
}