const express = require("express")
const app = express()
const UserRoutes = require("./routes/UserRoutes")
const BlogRoutes = require("./routes/blogRoutes")
const cookie = require("cookie-parser")
const cors = require("cors")
const ReviewRoutes= require("./routes/reviewRoutes")
const helmet = require("helmet")
const path = require("path")

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const _dirname = path.resolve()

app.use(cookie())
app.use(helmet());
 

// ✅ Must come BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
// Routes should come AFTER body parsers
app.use("/user", UserRoutes)
app.use("/blog", BlogRoutes)
app.use("/review", ReviewRoutes)

app.use(express.static(path.join(_dirname,"frontend/dist")))
app.get("*",(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.js"))
})
module.exports = app


