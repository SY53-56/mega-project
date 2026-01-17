require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/db/connect");

const UserRoutes = require("./src/routes/UserRoutes");
const BlogRoutes = require("./src/routes/blogRoutes");
const ReviewRoutes = require("./src/routes/reviewRoutes");

const app = express();
/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://mega-project-85fr.vercel.app/"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // browser direct hit (postman / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);
/* ================= MIDDLEWARE ================= */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/user", UserRoutes);
app.use("/blog", BlogRoutes);
app.use("/review", ReviewRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`🚀 Backend running on port ${PORT}`)
    );
  } catch (error) {
    console.log("❌ Server failed:", error.message);
  }
};

start();
