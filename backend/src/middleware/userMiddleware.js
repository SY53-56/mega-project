const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.token || (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
console.log("token ", token)
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = { id: decoded.id };

    next();
  } catch (e) {
    console.error("JWT error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = userMiddleware;
