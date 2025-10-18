import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/blog", getAuthHeader(token));
      return res.data; // expect: { blogs: [...] }
    } catch (e) {
      const message = e.response?.data?.message || e.message || "Failed to fetch blogs";
      return rejectWithValue(message);
    }
  }
);

export const fetchUserAccount = createAsyncThunk(
  "blog/user",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/blog/${userId}`, getAuthHeader(token));
      return res.data; // expect: { blog: {...} }
    } catch (e) {
      const message = e.response?.data?.message || e.message || "Failed to fetch user blog";
      return rejectWithValue(message);
    }
  }
);

export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async (blogData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/blog", blogData, getAuthHeader(token));
      return res.data; // expect: { success: true, blog: {...} }
    } catch (e) {
      if (e.response?.status === 401) return rejectWithValue("Token expired. Please login again.");
      const message = e.response?.data?.message || e.message || "Failed to add blog";
      return rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [],
    currentBlog: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchGetData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGetData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload.blogs || [];
        state.error = null;
      })
      .addCase(fetchGetData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add blog
      .addCase(fetchAddData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAddData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.blog) state.blog.unshift(action.payload.blog);
        state.error = null;
      })
      .addCase(fetchAddData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch single blog (user)
      .addCase(fetchUserAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBlog = action.payload.blog || null;
        state.error = null;
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default blogSlice.reducer;
