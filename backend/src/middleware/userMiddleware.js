const jwt = require("jsonwebtoken");

const userMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // ✅ decoded = { id: user._id }
    req.user = { id: decoded.id };

    next();
  } catch (e) {
    console.error("JWT error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = userMiddleware;
