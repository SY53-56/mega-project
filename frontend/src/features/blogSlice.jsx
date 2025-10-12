import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to add token to request
const getAuthHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Fetch all blogs
export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:3000/user/", getAuthHeader(token));
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

// Add blog
export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async ({ token, blogData }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3000/user/blog", blogData, getAuthHeader(token));
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

// Update blog
export const fetchUpdateData = createAsyncThunk(
  "blog/updateData",
  async ({ token, id, blogData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:3000/user/blog/${id}`, blogData, getAuthHeader(token));
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

// Delete blog
export const fetchDeleteData = createAsyncThunk(
  "blog/deleteData",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/user/blog/${id}`, getAuthHeader(token));
      return id;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: { blog: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetData.fulfilled, (state, action) => {
        state.blog = action.payload;
      })
      .addCase(fetchAddData.fulfilled, (state, action) => {
        state.blog.unshift(action.payload); // add new blog to top
      })
      .addCase(fetchUpdateData.fulfilled, (state, action) => {
        state.blog = state.blog.map(b => b.id === action.payload.id ? action.payload : b);
      })
      .addCase(fetchDeleteData.fulfilled, (state, action) => {
        state.blog = state.blog.filter(b => b.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
