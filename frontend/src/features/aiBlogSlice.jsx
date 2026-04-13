import { createSlice } from "@reduxjs/toolkit";
import { generateAiBlogThunk, getAiBlogPostThunk } from "./aiBlogThunk";

const initialState = {
  aiblogs: [],
  aiblog: {},
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const aiblogSlice = createSlice({
  name: "aiblog",
  initialState,
  extraReducers: (builder) => {
    builder

      // 🔥 GENERATE BLOG
      .addCase(generateAiBlogThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(generateAiBlogThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
  console.log("REDUX PAYLOAD:", action.payload);
        const blog = action.payload?.data;

        state.aiblog = blog || {};

        // add to list (optional but useful)
        if (blog) {
          state.aiblogs.push(blog);
        }
      })

      .addCase(generateAiBlogThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to generate blog";
      })

      // 🔥 GET SINGLE BLOG
      .addCase(getAiBlogPostThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getAiBlogPostThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
          console.log("REDUX PAYLOAD:", action.payload);
        state.aiblog = action.payload?.data || {};
      })

      .addCase(getAiBlogPostThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch blog";
      });
  },
});

export default aiblogSlice.reducer;