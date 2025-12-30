const jwt = require("jsonwebtoken");

// Middleware to verify JWT from cookie
const userMiddleware = (req, res, next) => {
  console.log("🔥 Middleware HIT");
  console.log("🍪 Cookies:", req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ JWT Error:", err.message);

    // Automatically clear the invalid/old cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
      sameSite: "lax",
    });

    // Optional: force client to login again
    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};

module.exports = userMiddleware;
