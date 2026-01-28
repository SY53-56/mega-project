const Blog = require('../models/blogModel')
const slugify = require("slugify");
const { nanoid } = require("nanoid");
const User = require("../models/userModel");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

/* ================= GET ALL BLOGS ================= */
const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find()
        .select("title description  image slug createdAt like author")
        .populate("author", "username image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= POST BLOG ================= */
const postBlogData = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const files = req.files || [];
    if (files.length > 5) {
      return res.status(400).json({ message: "Max 5 images allowed" });
    }

    const uploadedImages = await Promise.all(
      files.map(file => uploadBufferToCloudinary(file.buffer))
    );

    const blog = await Blog.create({
      title,
      description,
      slug: `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`,
      image: uploadedImages.map(img => img.secure_url),
      imagePublicId: uploadedImages.map(img => img.public_id),
      author: req.user._id,
    });

    res.status(201).json({ success: true, blog });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/* ================= GET SINGLE BLOG ================= */
const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .select("title description image createdAt like author slug")
      .populate("author", "username image")
      .lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const userAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const user = await User.findById(id)
      .select("username image bio followers following saveBlogs")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({ author: id })
      .select("title description image slug createdAt like author") // <-- add author here
      .populate("author", "username image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      user,
      blogs,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/* ================= UPDATE BLOG ================= */
const updateBlogData = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;

    if (req.files?.length) {
      await Promise.all(
        blog.imagePublicId.map(pid => cloudinary.uploader.destroy(pid))
      );

      const uploads = await Promise.all(
        req.files.map(file => uploadBufferToCloudinary(file.buffer))
      );

      blog.image = uploads.map(u => u.secure_url);
      blog.imagePublicId = uploads.map(u => u.public_id);
    }

    await blog.save();
    res.json({ success: true, blog });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

/* ================= DELETE BLOG ================= */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Promise.all(
      blog.imagePublicId.map(pid => cloudinary.uploader.destroy(pid))
    );

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LIKE / UNLIKE ================= */
const likePostApi = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const unliked = await Blog.findOneAndUpdate(
      { _id: blogId, like: userId },
      { $pull: { like: userId } },
      { new: true }
    );

    if (unliked) {
      return res.json({ liked: false });
    }

    await Blog.findByIdAndUpdate(
      blogId,
      { $addToSet: { like: userId } },
      { new: true }
    );

    res.json({ liked: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPORT ================= */
module.exports = {
  getAllBlogs,
  postBlogData,
  getSingleBlog,
  userAccount,
  updateBlogData,
  deleteBlog,
  likePostApi,
};
