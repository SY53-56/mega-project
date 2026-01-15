const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const UserRoutes = require("./routes/UserRoutes");
const BlogRoutes = require("./routes/blogRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");

const app = express();
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL; // FRONTEND URL from env

// ✅ CORS
app.use(cors({
  origin: FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", FRONTEND_URL, "https://res.cloudinary.com"],
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", UserRoutes);
app.use("/blog", BlogRoutes);
app.use("/review", ReviewRoutes);

// Root endpoint (optional)
app.get("/", (_, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

