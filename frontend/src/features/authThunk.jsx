import { createAsyncThunk, } from "@reduxjs/toolkit";

import api from "../api";

 const fetchSignup = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/signup",userData);

      return res.data; 
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

  const fetchLogin = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/user/login", data);
      return res.data; // cookie already set by backend
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);


 const followUser = createAsyncThunk(
  "user/follow",
  async (authorId, {  rejectWithValue }) => {
    try {
      
     const res = await api.put(`/user/follow/${authorId}`)

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
const logout = createAsyncThunk("logout/user",async(_,{rejectWithValue})=>{
 try{
   let res = api.post("/logout")
   return res.data
 }catch(e){
  return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to follow user"
      );
 }
})
const fetchMe= createAsyncThunk("user/data",async(_ ,{   rejectWithValue})=>{
    try{
   let res= await api.get("/user/userAccount")
    return res.data
    }catch(e){
       return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to follow user"
      );
    }
})


export  {
 fetchLogin,
 fetchSignup,
 followUser,
 fetchMe,
 logout,

}