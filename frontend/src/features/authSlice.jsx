import {  createSlice } from "@reduxjs/toolkit";
import { fetchLogin, fetchSignup, followUser, fetchMe } from "./authThunk";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:JSON.parse(localStorage.getItem("user"))|| null,
    error: null,
    status: "idle",
  },
  reducers:{
  logout: (state) => {
      state.user = null;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("user")
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
        localStorage.setItem("user", JSON.stringify(action.payload.user));
   
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
        localStorage.setItem("user",JSON.stringify(action.payload.user))
    
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
           localStorage.setItem("user",JSON.stringify(action.payload.user))
              
        state.error = null;
      
   
      })
      .addCase(followUser.rejected,(state,action)=>{
         state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
  state.user = action.payload;
  localStorage.setItem("user", JSON.stringify(action.payload));
})
  },
});
export const { logout } = authSlice.actions; 
export default authSlice.reducer;
