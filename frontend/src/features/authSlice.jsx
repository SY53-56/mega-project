import {  createSlice } from "@reduxjs/toolkit";
import { fetchLogin, fetchSignup, followUser, fetchMe, fetchSaveBlog } from "./authThunk";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  null,
    
    error: null,
    status: "idle",
  },
  reducers:{
   logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.status = "idle";
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSignup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      
      
        state.error = null;
     
        // persist user
   
      })
      .addCase(fetchSignup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
     
    
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(followUser.pending,(state)=>{
         state.status = "loading";
        state.error = null;
      })
      .addCase(followUser.fulfilled,(state ,action)=>{
           state.status = "succeeded";
           state.user = action.payload.user;
         
     
              
        state.error = null;
      
   
      })
    
      .addCase(fetchMe.fulfilled, (state, action) => {
         state.status = "succeeded";
  state.user = action.payload.user||action.payload
   state.error = action.payload

}).addCase(fetchSaveBlog.fulfilled,(state,action)=>{
  state.status = "succeeded";
  state.user= action.payload.user

  state.error = action.payload
})

  },
});
export const { logout } = authSlice.actions; 
export default authSlice.reducer;
