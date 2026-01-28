const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");

const isProd = process.env.NODE_ENV === "production";

// ================= JWT =================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= SIGNUP =================
const userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const fileImg = req.file
      ? await uploadBufferToCloudinary(req.file.buffer)
      : null;

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      image: fileImg?.secure_url || "",
    });

    const token = generateToken(newUser._id);

    // ✔️ cookie settings for localhost
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      image: newUser.image,
      saveBlogs: [],
    });
  } catch (e) {
    console.error("Signup Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("1. LOGIN ATTEMPT FOR:", email);

    // Populate ko temporarily hata kar check karte hain agar crash wahan se hai
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      console.log("2. USER NOT FOUND");
      return res.status(401).json({ message: "Invalid credentials email" });
    }

    console.log("3. USER FOUND, COMPARING PASSWORD...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("4. PASSWORD MISMATCH");
      return res.status(401).json({ message: "Invalid credentials password" });
    }

    console.log("5. PASSWORD MATCHED, GENERATING TOKEN...");
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, 
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Password hata kar bacha hua data bhejna sabse safe hai
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log("6. LOGIN SUCCESSFUL, SENDING DATA");
    res.status(200).json(userResponse);

  } catch (e) {
    console.error("!!! LOGIN CRASHED !!!", e.message);
    // Ye line aapko browser console mein batayegi ki asli problem kya hai
    res.status(500).json({ message: "Backend Error: " + e.message });
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
      .populate("saveBlogs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (e) {
    console.error("UserData Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= SAVE / UNSAVE BLOG =================
const saveBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = user.saveBlogs
      .map((id) => id.toString())
      .includes(blogId.toString());

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      isSaved
        ? { $pull: { saveBlogs: blogId } }
        : { $addToSet: { saveBlogs: blogId } },
      { new: true }
    )
      .select("-password")
      .populate("saveBlogs");

    res.status(200).json({
      success: true,
      message: isSaved ? "Blog unsaved" : "Blog saved",
      user: updatedUser,
    });
  } catch (e) {
    console.error("SaveBlog Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= FOLLOW / UNFOLLOW =================
const follower = async (req, res) => {
  try {
    const userId = req.params.id;
    const followerId = req.user.id;

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
    console.error("Follower Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET FOLLOWER DATA =================
const getFollowerData = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("followers following", "username image");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (e) {
    console.error("GetFollowerData Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userData,
  saveBlog,
  follower,
  getFollowerData,
};
