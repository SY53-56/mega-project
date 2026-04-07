import { createSlice } from "@reduxjs/toolkit";

import{ generateAiBlogThunk, getAiBlogPostThunk } from "./aiBlogThunk"

const initialState={
    aiblogs:[],
    aiblog: {},
     status: "idle",
    error:null
}

const aiblogSlice = createSlice({
  name:"aiblog",
  initialState,
  extraReducers:(builder)=>{
    builder.addCase(generateAiBlogThunk.pending,(state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateAiBlogThunk.fulfilled, (state,action)=>{
        state.status ="successfull",
        state.aiblog = action.payload.data
      })
      .addCase(generateAiBlogThunk.rejected, (state ,action)=>{
       state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAiBlogPostThunk.pending,(state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAiBlogPostThunk.fulfilled, (state,action)=>{
        state.loading ="successfull",
        state.aiblog = action.payload.data
      })
      .addCase(getAiBlogPostThunk.rejected, (state ,action)=>{
       state.status = "failed";
        state.error = action.payload;
      })
  }
})


export default aiblogSlice.reducer