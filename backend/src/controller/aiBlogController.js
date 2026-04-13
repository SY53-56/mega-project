const AiBlogModel = require("../models/aiBlogModel");
const UserModel = require("../models/userModel");
const slugify = require("slugify");
const { nanoid } = require("nanoid");
const codeRun = require("../services/blog.api"); // AI function

const generateAiBlog = async (req, res) => {
  try {
    const { description } = req.body;

    // ✅ Validation
    if ( !description) {
      return res.status(400).json({
        success: false,
     message: "Description is required" 
      });
    }
console.log("description", description)
    // ✅ Check user
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 CALL AI HERE
    const aiContent = await codeRun(` ${description}`);
    console.log("aiContent",aiContent)
const generatedTitle =aiContent.split(" ").slice(0, 5).join(" ");
    if (!aiContent) {
      return res.status(500).json({
        success: false,
        message: "AI generation failed",
      });
    }

    // ✅ Save blog
    const aiBlogPost = await AiBlogModel.create({
    author: user._id,
    blogTitle: generatedTitle,
      blogDescription: aiContent,
    slug: `${slugify(generatedTitle, { lower: true, strict: true })}-${nanoid(6)}`,
    });
 console.log(aiBlogPost)
    return res.status(200).json({
      success: true,
      message: "AI blog generated successfully",
      data: aiBlogPost,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getaiBlogPost = async(req,res)=>{
    try{
       const aiBlogId = req.params.id
       const aiBlogPost = await AiBlogModel.findById(aiBlogId)
       if (!aiBlogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

        return res.status(200).json({
      success: true,
      message: "AI blog generated successfully",
      data: aiBlogPost,
    });
    } catch(e){
        res.status(404).json({message:e})
    }
}
module.exports = {
  generateAiBlog,
  getaiBlogPost
};