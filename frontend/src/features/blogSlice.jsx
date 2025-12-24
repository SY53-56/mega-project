import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to attach Authorization header
const getAuthHeader = (token ) => ({
  headers:  {Authorization: `Bearer ${token}`}})


// ------------------- Thunks -------------------

// Fetch all blogs
export const fetchGetData = createAsyncThunk(
  "blog/getData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/blog", getAuthHeader(token ));
      return res.data; // { blogs: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blogs");
    }
  }
);

// Fetch single blog by ID
export const fetchGetSingleBlog = createAsyncThunk(
  "blog/singleBlog",
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/blog/${blogId}`, getAuthHeader(token));
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch blog");
    }
  }
);

// Fetch all blogs of a specific user
export const fetchUserAccount = createAsyncThunk(
  "blog/user",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/blog/user/${userId}`, getAuthHeader(token));
      return res.data; // { blog: [...] }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to fetch user blogs");
    }
  }
);

export const fetchAddData = createAsyncThunk(
  "blog/addData",
  async (blogData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/blog",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}` // DON'T set Content-Type
          }
        }
      );

      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message || "Failed to add blog"
      );
    }
  }
);

// Update a blog
export const fetchUpdate = createAsyncThunk(
  "blog/update",
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/blog/${id}`, updateData, getAuthHeader(token));
      return res.data; // { blog: {...} }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to update blog");
    }
  }
);

// Delete a blog
export const fetchDelete = createAsyncThunk(
  "blog/delete",
  async (blogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/blog/delete/${blogId}`, getAuthHeader(token));
      return { blogId, ...res.data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete blog");
    }
  }
);

export const fetchReview = createAsyncThunk("review/data", async(blogId,{getState,rejectWithValue})=>{
  try{
  const token = getState().auth.token || localStorage.getItem("token")
  const res=await axios.get(`http://localhost:5000/review/${blogId}`,getAuthHeader(token))
   return res.data
  }catch(e){
      return rejectWithValue(e.response?.data?.message || e.message || "Failed to show review");
  }
})
export const fetchReviewPost = createAsyncThunk(
  "review/post",
  async ({ blogId, reviewData }, { getState, rejectWithValue }) => {
    try {
      const token =
        getState().auth.token || localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:5000/review/${blogId}`,
        reviewData, // { comment, rating }
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || e.message || "Failed to post review"
      );
    }
  }
);

export const fetchReviewDelete= createAsyncThunk("review/delete",async(blogId,{getState,rejectWithValue})=>{
  try{
    const token= getState().auth.token || localStorage.getItem('token')
    const res = await axios.delete(`http://localhost:5000/review/${blogId}`, getAuthHeader(token))
    return res.data
  }catch(e){
    return rejectWithValue(e.response?.data?.message || e.message || "Failed to delete review");
  }
})
// ------------------- Slice -------------------
const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [], 
    user:null, 
    review:[],        // all blogs or user blogs
    currentBlog: null, // single blog
    status: "idle",    // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchGetData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGetData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload.blogs || [];
      })
      .addCase(fetchGetData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch single blog
      .addCase(fetchGetSingleBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGetSingleBlog.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBlog = action.payload.blog || null;
      })
      .addCase(fetchGetSingleBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch user blogs
      .addCase(fetchUserAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blog = action.payload.blog || [];
        state.user = action.payload.user || null
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
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
      })
      .addCase(fetchAddData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update blog
      .addCase(fetchUpdate.fulfilled, (state, action) => {
        // Update current blog if matches
        if (state.currentBlog && state.currentBlog._id === action.payload.blog._id) {
          state.currentBlog = action.payload.blog;
        }

        // Update blog in array
        state.blog = state.blog.map(b =>
          b._id === action.payload.blog._id ? action.payload.blog : b
        );

        state.status = "succeeded";
        state.error = null;
      })

      // Delete blog
      .addCase(fetchDelete.fulfilled, (state, action) => {
        // Remove from currentBlog if matches
        if (state.currentBlog && state.currentBlog._id === action.payload.blogId) {
          state.currentBlog = null;
        }

        // Remove from blog array
        state.blog = state.blog.filter(b => b._id !== action.payload.blogId);

        state.status = "succeeded";
        state.error = null;
      })// ------------------- Reviews -------------------
.addCase(fetchReview.pending, (state) => {
  state.status = "loading";
})
.addCase(fetchReview.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.review = action.payload.reviews || []; // store all reviews
})
.addCase(fetchReview.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload;
})
.addCase(fetchReviewPost.fulfilled, (state, action) => {
  state.status = "succeeded";
  // Add new review at top
  if (action.payload.review) {
    state.review.unshift(action.payload.review);
  }
})
.addCase(fetchReviewPost.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload;
})
.addCase(fetchReviewDelete.pending, (state) => {
  state.status = "loading";
})
.addCase(fetchReviewDelete.fulfilled, (state, action) => {
  state.status = "succeeded";
  const deletedId = action.payload.reviewId;
  if (deletedId) {
    state.review = state.review.filter((r) => r._id !== deletedId);
  }
})
.addCase(fetchReviewDelete.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload;
});


  },
});

export default blogSlice.reducer;
