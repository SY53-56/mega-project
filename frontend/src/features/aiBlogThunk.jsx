import { createAsyncThunk } from "@reduxjs/toolkit";
 import api from "../api";
 const generateAiBlogThunk = createAsyncThunk("/ai/post", async({blog},{ rejectWithValue})=>{
    try{
  const response = await api.post("/api/blog/ai/generate", blog)
  return response.data
    }catch(e){
         return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to saver"
      );
    }
 })
 const getAiBlogPostThunk = createAsyncThunk("ai/get",async(id,{rejectWithValue})=>{
    try{
         const response = await api.get(`/api/blog/ai/${id}`)
         return response.data
    }catch(e){
        return rejectWithValue(
        e.response?.data?.message ||
        e.message ||
        "Failed to saver"
      );
    }
 })
 export {
    getAiBlogPostThunk,
    generateAiBlogThunk
 }