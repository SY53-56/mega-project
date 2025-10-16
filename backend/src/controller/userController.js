const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashPassword });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { id: user._id, username: user.username },  token:token
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email invalid" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password invalid" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: { id: user._id, username: user.username },  token:token
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
};
