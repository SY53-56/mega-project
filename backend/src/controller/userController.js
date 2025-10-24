const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_TOKEN is not set in environment variables");
  }
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_TOKEN,
    { expiresIn: "1d" }
  );
};

// -------------------- SIGNUP --------------------
const userSignup = async (req, res) => {
  try {
    const { username, email, password, img } = req.body;

    // 1️⃣ Validate required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // 2️⃣ Check if email already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 3️⃣ Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user (img is optional)
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      img: img || "", // default to empty string if not provided
    });

    // 5️⃣ Generate JWT token
    const token = generateToken(user);

    // 6️⃣ Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // 7️⃣ Send success response
    res.status(201).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
};

const userData=async(req, res)=>{
 const userId = req.params.id
   const user=await User.find(userId)
   res.status(201).json({success:false, user})
}
//LOGIN --------------------
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    
    // 3️⃣ Compare password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Email or password invalid" });
    }

    // 4️⃣ Generate token
    const token = generateToken(user);

    // 5️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // 6️⃣ Success response
    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: e.message || "Server error" });
  }
};

// -------------------- LOGOUT --------------------
const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userData
};
