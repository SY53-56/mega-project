import {  createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to attach Authorization header
const getAuthHeader = (token ) => ({
  headers:  {Authorization: `Bearer ${token}`}})


// ------------------- Thunks -------------------

// Fetch all blogs
 export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/blog", getAuthHeader(token ));
      return res.data; // { blogs: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blogs");
    }
  }
);

  export const fetchGetSingleBlog = createAsyncThunk(
  "blog/singleBlog",
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/blog/${blogId}`, getAuthHeader(token));
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blog");
    }
  }
);

// Fetch all blogs of a specific user
 export const fetchUserAccount = createAsyncThunk(
  "blog/user",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/blog/user/${userId}`, getAuthHeader(token));
      return res.data; // { blog: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch user blogs");
    }
  }
);

 export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async (blogData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/blog",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}` // DON'T set Content-Type
          }
        }
      );

      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message || "Failed to add blog"
      );
    }
  }
);

// Update a blog
 export const fetchUpdate = createAsyncThunk(
  "blog/update",
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/blog/${id}`, updateData, getAuthHeader(token));
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to update blog");
    }
  }
);

// Delete a blog
export const fetchDelete = createAsyncThunk(
  "blog/delete",
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/blog/delete/${blogId}`, getAuthHeader(token));
      return { blogId, ...res.data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete blog");
    }
  }
);

  export const fetchReview = createAsyncThunk("review/data", async(blogId,{getState,rejectWithValue})=>{
  try{
  const token = getState().auth.token || localStorage.getItem("token")
  const res=await axios.get(`http://localhost:5000/review/${blogId}`,getAuthHeader(token))
   return res.data
  }catch(e){
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to show review");
  }
})
 export const fetchReviewPost = createAsyncThunk(
  "review/post",
  async ({ blogId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth.token || localStorage.getItem("token");
 console.log("toekn" , token)
      const res = await axios.post(
        `http://localhost:5000/review/${blogId}`,
        reviewData, // { comment, rating }
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message || "Failed to post review"
      );
    }
  }
);

 export const fetchReviewDelete= createAsyncThunk("review/delete",async(blogId,{getState,rejectWithValue})=>{
  try{
    const token= getState().auth.token || localStorage.getItem('token')
    const res = await axios.delete(`http://localhost:5000/review/${blogId}`, getAuthHeader(token))
    return res.data
  }catch(e){
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete review");
  }
})