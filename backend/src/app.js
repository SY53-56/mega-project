const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const UserRoutes = require("./routes/UserRoutes");
const BlogRoutes = require("./routes/blogRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");

const _dirname = path.resolve();
const isProd = process.env.NODE_ENV === "production";

// ✅ CORS (LOCAL + RENDER)
app.use(
  cors({
    origin: isProd
      ? "https://YOUR_FRONTEND.onrender.com"
      : "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com"
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: [
          "'self'",
          "http://localhost:5173",
          "https://YOUR_FRONTEND.onrender.com",
          "https://res.cloudinary.com"
        ],
      },
    },
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", UserRoutes);
app.use("/blog", BlogRoutes);
app.use("/review", ReviewRoutes);

// ✅ Serve React build
app.use(express.static(path.join(_dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(_dirname, "frontend", "dist", "index.html")
  );
});

module.exports = app;



