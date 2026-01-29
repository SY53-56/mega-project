import axios from "axios";


const isLocal = window.location.hostname === "localhost";
const api = axios.create({
  baseURL:isLocal ?"http://localhost:5000": "https://mega-project-12.onrender.com",
  withCredentials: true,
  
});

export default api;

