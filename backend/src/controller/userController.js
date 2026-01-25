const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");

// 🔐 JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const isProd = process.env.NODE_ENV === "production";

// ================= SIGNUP =================
const userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashPassword = await bcrypt.hash(password, 10);
    const fileImg = req.file ? await uploadBufferToCloudinary(req.file.buffer) : null;

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      image: fileImg?.secure_url || ""
    });

    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = await User.findById(newUser._id)
      .select("-password")
      .populate({
        path: "saveBlogs",
        populate: { path: "author", select: "username image" }
      });

    res.status(201).json({ user });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate({
        path: "saveBlogs",
        populate: { path: "author", select: "username image" }
      });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const savedBlogCount = await Blog.countDocuments({ _id: { $in: user.saveBlogs } });
    console.log("Saved blogs exist:", savedBlogCount);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined; // remove password

    // 🔥 RETURN POPULATED USER DIRECTLY
    res.status(200).json({ user });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// ================= LOGOUT =================
const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// ================= USER DATA =================
const userData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "saveBlogs",
        populate: { path: "author", select: "username image" }
      }).lean()

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ user });

  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= SAVE BLOG =================
const saveBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });


       const isSaved = user.saveBlogs.some((blog) =>
      blog._id
        ? blog._id.toString() === blogId
        : blog.toString() === blogId
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      isSaved
        ? { $pull: { saveBlogs: blogId } }
        : { $addToSet: { saveBlogs: blogId } },
      { new: true }
    ).populate({
      path: "saveBlogs",
      populate: { path: "author", select: "username image" }
    });

    res.status(200).json({
      success: true,
      message: isSaved ? "Blog unsaved" : "Blog saved",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= FOLLOW/UNFOLLOW =================
const follower = async (req, res) => {
  try {
    const userId = req.params.id;   // user to follow
    const followerId = req.user.id; // logged-in user

    if (userId === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const followerUser = await User.findById(followerId);

    if (!user || !followerUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = followerUser.following.includes(userId);

    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: followerId },
      });

      await User.findByIdAndUpdate(followerId, {
        $pull: { following: userId },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: followerId },
      });

      await User.findByIdAndUpdate(followerId, {
        $addToSet: { following: userId },
      });
    }

    const updatedUser = await User.findById(followerId)
      .select("-password")
      .populate("followers following", "username image");

    res.status(200).json({
      success: true,
      followed: !isFollowing,
      user: updatedUser,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFollowerData = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findById(userid)
      .populate("followers", "username image")
      .populate("following", "username image");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (e) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userData,
  saveBlog,
  getFollowerData,
  follower
};
