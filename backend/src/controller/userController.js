const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Helper: Generate JWT token
const generateToken = (user) => {
  if (!process.env.JWT_TOKEN) {
    throw new Error("JWT_TOKEN is not set in environment variables");
  }

  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_TOKEN,
    { expiresIn: "7d" } // Token valid for 7 days
  );
};

// -------------------- SIGNUP --------------------
const userSignup = async (req, res) => {
  try {
    const { username, email, password, img } = req.body;

    // 1️⃣ Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 2️⃣ Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 3️⃣ Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      img: img || "",
    });

    // 5️⃣ Generate JWT token
    const token = generateToken(user);

    // 6️⃣ Set cookie (7 days)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ Match token lifetime (7 days)
      sameSite: "lax",
    });

    // 7️⃣ Send response
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

// -------------------- LOGIN --------------------
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or password invalid" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email or password invalid" });
    }

    // 3️⃣ Generate JWT
    const token = generateToken(user);

    // 4️⃣ Set cookie (7 days)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ Match 7 days
      sameSite: "strict",
    });

    // 5️⃣ Respond
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

// -------------------- GET SINGLE USER --------------------
const userData = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // remove password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (e) {
    console.error("User data error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userData,
};
