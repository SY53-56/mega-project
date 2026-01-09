const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userMiddleware = async (req, res, next) => {
  

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   

    // ✅ FETCH FULL USER (INCLUDING IMAGE)
    

    req.user = decoded; // 🔥 FULL USER OBJECT
    next();

  } catch (err) {
    console.log("❌ JWT Error:", err.message);

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(401).json({
      message: "Invalid or expired token. Please login again.",
    });
  }
};
module.exports= userMiddleware
/*

module.exports = userMiddleware;

 const userMiddleware1 = (req, res, next) =>{

  const token = req.cookies.token; 
  if (!token) { return res.status(401).json({ message: "Login required" }); } 

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("✅ Decoded JWT:", decoded);
     req.user = decoded;
      next(); }
      catch (err) { console.log("❌ JWT Error:", err.message) } }*/