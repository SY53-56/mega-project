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

 const followUser = createAsyncThunk(
  "user/follow",
  async (authorId, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth.token || localStorage.getItem("token");
          
      if (!token) {
        return rejectWithValue("Please login to follow users");
      }

      const res = await axios.put(
        `http://localhost:5000/user/follow/${authorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data; // { user, token? }
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to follow user"
      );
    }
  }
);

export  {
 fetchLogin,
 fetchSignup,
 followUser
}