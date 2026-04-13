import { createAsyncThunk } from "@reduxjs/toolkit";
 import api from "../api";
 const generateAiBlogThunk = createAsyncThunk("/ai/post", async(description,{ rejectWithValue})=>{
    console.log("🔥 THUNK STARTED");
    try{
  const response = await api.post("/api/blog/ai/generate",{description})
  console.log('response',response.data)
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
    console.log("🔥 THUNK STARTED");
    try{
         const response = await api.get(`/api/blog/ai/${id}`)
         console.log( "dataghjwha",response.data)
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