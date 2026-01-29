import {  createSlice } from "@reduxjs/toolkit";
import { fetchLogin, fetchSignup, followUser, fetchMe, fetchSaveBlog } from "./authThunk";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:  JSON.parse(sessionStorage.getItem("user")) || null,
    
    error: null,
    status: "idle",
  },
  reducers:{
   logout: (state) => {
      state.user = null;
   
      state.error = null;
      state.status = "idle";
     sessionStorage.removeItem("user");
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
        state.user = action.payload
      
      
        state.error = null;
   sessionStorage.setItem("user", JSON.stringify(action.payload));
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
        state.user = action.payload
       state.error = null;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
     
    
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
           state.user = action.payload
        
     sessionStorage.setItem("user",JSON.stringify(action.payload))
              
        state.error = null;
      
   
      })
    
      .addCase(fetchMe.fulfilled, (state, action) => {
         state.status = "succeeded";
  state.user = action.payload
  state.error = null;
   sessionStorage.setItem("user",JSON.stringify(action.payload))

}).addCase(fetchSaveBlog.fulfilled,(state,action)=>{
  state.status = "succeeded";
  state.user= action.payload
   sessionStorage.setItem("user",JSON.stringify(action.payload))
state.error = null;
})

  },
});
export const { logout } = authSlice.actions; 
export default authSlice.reducer;
