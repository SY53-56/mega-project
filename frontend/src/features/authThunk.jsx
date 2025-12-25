import { createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

 const fetchSignup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/user/signup", userData ,);
         console.log("Signup response:", res.data); // you can log here
           localStorage.setItem("token", res.data.token);
      return res.data; 
    } catch (e) {
      const message =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : e.message || "Failed to fetch";
      return rejectWithValue(message);
    }
  }
);

 const fetchLogin = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/user/login", userData,);
        localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e) {
      const message =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : e.message || "Failed to fetch";
      return rejectWithValue(message);
    }
  }
);

export  {
 fetchLogin,
 fetchSignup
}