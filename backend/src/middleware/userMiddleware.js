const jwt = require("jsonwebtoken");


const userMiddleware= async(req, res ,next)=>{
  const token =  res.cookies.token ||  req.headers.authorization?.split(" ")[1]
    if(!token)return res.status(401).json({ message: "Unauthorized" });
    try{
        const decode = jwt.verify(token, process.env.JWT_TOKEN)
        req.user -decode
        next()
    }catch(e){
        res.status(401).json({message:"invaild"})
    }
}

module.exports = {
    userMiddleware
}