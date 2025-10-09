const Blog= require("../models/blogModel")


const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // fetch all documents
    res.status(200).json({ success: true, blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const postBlogData =async(req,res)=>{
try{
const {title, description ,image} = req.body 
if(!title || !description ) return res.status(400).json({message:"title is empty"})
    const authorId = req.user.id
  const blog = await Blog.create({title,description,image, author: authorId,})
  res.status(200).json({success:true , blog})
}catch(e){
console.log(e)
}
}
const updateBlogData = async (req, res) => {
  try {
    const { id } = req.params; // from URL, e.g., /blog/:id
    const updates = req.body;   // the fields to update

    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (e) {
    console.error(e);
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
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { deleteBlog };

module.exports= {
    getAllBlogs,
    postBlogData,
    updateBlogData,
    deleteBlog
}