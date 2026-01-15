const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary")


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
    const { username, email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
   const fileImg = req.file ? await uploadBufferToCloudinary(req.file.buffer) : null;

    const user = await User.create({
      username,
      email,
      password: hashPassword,
      image: fileImg?.secure_url || ""
    });

    const token = generateToken(user);

    // ✅ CORRECT COOKIE CONFIG
   res.cookie("token", token, {
  httpOnly: true,
  secure: isProd,                     // localhost: false, prod: true
  sameSite: isProd ? "none" : "lax", // localhost: lax, prod: none
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
});

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// ================= LOGIN =================
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
console.log(token)
    // ✅ SAME COOKIE CONFIG
  res.cookie("token", token, {
  httpOnly: true,
  secure: isProd,                     // localhost: false, prod: true
  sameSite: isProd ? "none" : "lax", // localhost: lax, prod: none
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
});

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// ================= LOGOUT =================
const userLogout = (req, res) => {
  res.clearCookie("token", {
     httpOnly: true,
  secure: isProd,                     // localhost: false, prod: true
  sameSite: isProd ? "none" : "lax", // localhost: lax, prod: none

  });
   res.status(200).json({ success: true, message: "Logged out successfully" });
}
// -------------------- GET SINGLE USER --------------------
const userData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // remove password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (e) {
    console.error("User data error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};const saveBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blogId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSaved = user.saveBlogs.includes(blogId);

    // toggle save
    await User.findByIdAndUpdate(
      userId,
      isSaved
        ? { $pull: { saveBlogs: blogId } }
        : { $addToSet: { saveBlogs: blogId } },
      { new: true }
    );

    // ✅ THIS IS THE IMPORTANT PART
    const updatedUser = await User.findById(userId)
      .populate({
        path: "saveBlogs",
        populate: {
          path: "author",
          select: "username image"
        }
      });

    res.status(200).json({
      success: true,
      message: isSaved ? "Blog unsaved" : "Blog saved",
      user: updatedUser
    });

  } catch (err) {
    console.error("SAVE BLOG ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const follower = async (req, res) => {
  try {
    const userId = req.params.id;   // jisko follow karna hai
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

    // 🔥 VERY IMPORTANT: updated user bhejo
    const updatedUser = await User.findById(followerId);

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


const getFollowerData= async(req,res)=>{
  try{
         let {userid} =  req.params;
         
         let user = await User.findById(userid).populate("followers" , "username img").populate("following", "username img");
   if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
         res.status(200).json({success:true , user})
  }catch(e){
     res.status(500).json({ success: false, message: "Server error" });
  }
}
module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userData,
  saveBlog,
  getFollowerData,
  follower
}
