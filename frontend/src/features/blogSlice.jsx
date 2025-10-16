import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to read token from Redux state
const getAuthHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// --- Fetch all blogs ---
export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (_, { getState, rejectWithValue }) => {
    try {
    const token = getState().auth.token || localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/blog", getAuthHeader(token));
      return res.data;
    } catch (e) {
      const message =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : e.message || "Failed to fetch blogs";
      return rejectWithValue(message);
    }
  }
);

// --- Add blog ---
export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async (blogData, { getState, rejectWithValue }) => {
    try {
         const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/blog", blogData, getAuthHeader(token));
      return res.data;
    } catch (e) {
      if (e.response?.status === 401) {
        return rejectWithValue("Token expired. Please login again.");
      }
      const message =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : e.message || "Failed to add blog";
      return rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: { blog: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchGetData.fulfilled, (state, action) => {
        state.blog = action.payload;
        state.error = null;
      })
      .addCase(fetchGetData.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Add blog
      .addCase(fetchAddData.fulfilled, (state, action) => {
        state.blog.unshift(action.payload);
        state.error = null;
      })
      .addCase(fetchAddData.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default blogSlice.reducer;
