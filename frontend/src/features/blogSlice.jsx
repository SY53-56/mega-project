import { createSlice } from "@reduxjs/toolkit";
import { fetchReview,fetchAddData,fetchDelete,fetchGetData,fetchGetSingleBlog,fetchReviewDelete,fetchReviewPost,fetchUpdate,fetchUserAccount,} from "./BlogThunk";
// ------------------- Slice -------------------
const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [], 
    userProfile:null, 
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
        state.userProfile = action.payload.user || null
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
