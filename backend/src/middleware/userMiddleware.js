const jwt = require("jsonwebtoken");

const userMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (e) {
    console.error("JWT error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
module.exports =userMiddleware