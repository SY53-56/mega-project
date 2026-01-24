import {  createAsyncThunk } from "@reduxjs/toolkit";

import api from "../api";
import { setUploadPercent } from "./blogSlice";


// ------------------- Thunks -------------------

// Fetch all blogs
 export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (_, {  rejectWithValue }) => {
    try {
   
      const res = await api.get("/blog?page=1&limit=8",{
          
      });
      return res.data; // { blogs: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blogs");
    }
  }
);

  export const fetchGetSingleBlog = createAsyncThunk(
  "blog/singleBlog",
  async (blogId, { rejectWithValue }) => {
    try {

      const res = await api.get(`/blog/${blogId}`);
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blog");
    }
  }
);

// Fetch all blogs of a specific user
 export const fetchUserAccount = createAsyncThunk(
  "blog/user",
  async (userId, {  rejectWithValue }) => {
    try {
 
      const res = await api.get(`/blog/user/${userId}`);
      return res.data; // { blog: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch user blogs");
    }
  }
);


export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async ({ blogData }, {dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/blog", blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if ( progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(setUploadPercent(percent))
          }
        },
      });

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
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
   
      const res = await api.put(`/blog/${id}`, updateData,);
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to update blog");
    }
  }
);

// Delete a blog
export const fetchDelete = createAsyncThunk(
  "blog/delete",
  async (blogId, { rejectWithValue }) => {
    try {
   
      const res = await api.delete(`/blog/delete/${blogId}`, );
      return { blogId, ...res.data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete blog");
    }
  }
);

  export const fetchReview = createAsyncThunk("review/data", async(blogId,{rejectWithValue})=>{
  try{

  const res=await api.get(`/review/${blogId}`,)
   return res.data
  }catch(e){
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to show review");
  }
})
 export const fetchReviewPost = createAsyncThunk(
  "review/post",
  async ({ blogId, reviewData }, {  rejectWithValue }) => {
    try {
     

      const res = await api.post(
        `/review/${blogId}`,
        reviewData, // { comment, rating }
      
      );

      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message || "Failed to post review"
      );
    }
  }
);

 export const fetchReviewDelete= createAsyncThunk("review/delete",async(blogId,{rejectWithValue})=>{
  try{
    
    const res = await api.delete(`/review/${blogId}`)
    return res.data
  }catch(e){
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete review");
  }
})
 export const fetchLike = createAsyncThunk("like/blog",async(blogId,{rejectWithValue})=>{
   try{
    const res= await api.put(`/blog/like/${blogId}`)
    return {blogId , liked: res.data.liked}
   }catch(e){
 return rejectWithValue(e.response?.data?.message || e.message || "Failed to like blog");
   }
})
export const fetchFollowData= createAsyncThunk("follow/user",async(id,{rejectWithValue})=>{
  try{
    const res= await api.get(`/user/folowerAccount/${id}`)
    return res.data
  }catch(e){
    return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to follow user"
      );
  }
})