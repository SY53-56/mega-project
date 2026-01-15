import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://YOUR_BACKEND.onrender.com"
    : "http://localhost:5000",
  withCredentials: true, // 🔥 VERY IMPORTANT
});

export default api;
