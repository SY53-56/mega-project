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
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mega-project-85fr.vercel.app"
  ],
  credentials: true
}));

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

