const express = require("express")
const app = express()
const UserRoutes = require("./routes/UserRoutes")
const BlogRoutes = require("./routes/blogRoutes")
const cookie = require("cookie-parser")
const cors = require("cors")
const ReviewRoutes= require("./routes/reviewRoutes")
const helmet = require("helmet")


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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

module.exports = app


