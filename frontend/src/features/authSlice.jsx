import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSignup = createAsyncThunk(
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

export const fetchLogin = createAsyncThunk(
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:JSON.parse(localStorage.getItem("user"))|| null,
    token: localStorage.getItem("token"),
    error: null,
    status: "idle",
  },
  reducers:{
  logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("token")
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
        state.token = action.payload.token;
        state.error = null;
     
        // persist user
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
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
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("user",JSON.stringify(action.payload.user))
        localStorage.setItem("token",action.payload.token)
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { logout } = authSlice.actions; 
export default authSlice.reducer;
