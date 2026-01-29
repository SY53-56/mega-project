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

const sendUserResponse = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
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

    res.status(201).json(sendUserResponse(newUser));
  } catch (e) {
    console.error("Signup Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;


    // Populate ko temporarily hata kar check karte hain agar crash wahan se hai
    const ExistUser = await User.findOne({ email }).select("+password")

    if (!ExistUser) {
   
      return res.status(401).json({ message: "Invalid credentials email" });
    }

    
    const isMatch = await bcrypt.compare(password, ExistUser.password);
    
    if (!isMatch) {
      
      return res.status(401).json({ message: "Invalid credentials password" });
    }


    const token = generateToken(ExistUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, 
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Password hata kar bacha hua data bhejna sabse safe hai

    res.status(200).json(sendUserResponse(ExistUser));

  } catch (e) {

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
     .populate({
    path: "saveBlogs",
    populate: { path: "author", select: "username image" } // Ye line author ka data layegi
  });

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
      .populate({path: "saveBlogs", populate: { path: "author", select: "username image" }});

    res.status(200).json(updatedUser);

  } catch (e) {
    console.error("SaveBlog Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

const follower = async (req, res) => {
  try {
    const targetUserId = req.params.id; // Jise follow karna hai
    const myId = req.user.id; // Jo login hai

    if (targetUserId === myId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const me = await User.findById(myId);

    if (!targetUser || !me) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following (ID string comparison)
    const isFollowing = me.following.some(id => id.toString() === targetUserId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: myId } });
      const updatedMe = await User.findByIdAndUpdate(
        myId,
        { $pull: { following: targetUserId } },
        { new: true }
      ).populate("following", "username image"); // Populate taaki frontend ko details milein

      return res.status(200).json(updatedMe);
    } else {
      // Follow
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: myId } });
      const updatedMe = await User.findByIdAndUpdate(
        myId,
        { $addToSet: { following: targetUserId } },
        { new: true }
      ).populate("following", "username image");

      return res.status(200).json(updatedMe);
    }
  } catch (e) {
    console.error("Follow Error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowerData = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password")
      .populate("followers following", "username image");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json( user );
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
