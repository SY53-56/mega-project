import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFollowData,
  fetchReview,
  fetchAddData,
  fetchDelete,
  fetchGetData,
  fetchGetSingleBlog,
  fetchReviewDelete,
  fetchReviewPost,
  fetchUpdate,
  fetchUserAccount,
  fetchLike,
} from "./BlogThunk";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blog: [],
    currentBlog: null,

    userProfile: null,
    userBlog: [],

    review: [],

    followers: [],
    following: [],

    blogStatus: "idle",
    reviewStatus: "idle",
    followStatus: "idle",
    likeStatus: "idle",

    error: null,
    uploadPercent: 0,
  },

  reducers: {
    setUploadPercent: (state, action) => {
      state.uploadPercent = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= BLOG LIST =================
      .addCase(fetchGetData.pending, (state) => {
        state.blogStatus = "loading";
      })
      .addCase(fetchGetData.fulfilled, (state, action) => {
        state.blogStatus = "succeeded";
        state.blog = action.payload.blogs || [];
      })
      .addCase(fetchGetData.rejected, (state, action) => {
        state.blogStatus = "failed";
        state.error = action.payload;
      })

      // ================= SINGLE BLOG =================
      .addCase(fetchGetSingleBlog.pending, (state) => {
        state.blogStatus = "loading";
      })
      .addCase(fetchGetSingleBlog.fulfilled, (state, action) => {
        state.blogStatus = "succeeded";
        state.currentBlog = action.payload.blog || null;
      })
      .addCase(fetchGetSingleBlog.rejected, (state, action) => {
        state.blogStatus = "failed";
        state.error = action.payload;
      })

      // ================= USER ACCOUNT =================
      .addCase(fetchUserAccount.pending, (state) => {
        state.blogStatus = "loading";
      })
      .addCase(fetchUserAccount.fulfilled, (state, action) => {
        state.blogStatus = "succeeded";
        state.userProfile = action.payload.user || null;
        state.userBlog = action.payload.blogs || [];
      })
      .addCase(fetchUserAccount.rejected, (state, action) => {
        state.blogStatus = "failed";
        state.error = action.payload;
      })

      // ================= ADD BLOG =================
      .addCase(fetchAddData.pending, (state) => {
        state.blogStatus = "loading";
        state.uploadPercent = 0;
      })
      .addCase(fetchAddData.fulfilled, (state, action) => {
        state.blogStatus = "succeeded";
        if (action.payload.blog) {
          state.blog.unshift(action.payload.blog);
        }
        state.uploadPercent = 100;
      })
      .addCase(fetchAddData.rejected, (state, action) => {
        state.blogStatus = "failed";
        state.error = action.payload;
        state.uploadPercent = 0;
      })

      // ================= UPDATE BLOG =================
      .addCase(fetchUpdate.fulfilled, (state, action) => {
        const updatedBlog = action.payload.blog;

        state.blog = state.blog.map((b) =>
          b._id === updatedBlog._id ? updatedBlog : b
        );

        if (state.currentBlog?._id === updatedBlog._id) {
          state.currentBlog = updatedBlog;
        }

        state.blogStatus = "succeeded";
      })

      // ================= DELETE BLOG =================
      .addCase(fetchDelete.fulfilled, (state, action) => {
        const { blogId } = action.payload;

        state.blog = state.blog.filter((b) => b._id !== blogId);

        if (state.currentBlog?._id === blogId) {
          state.currentBlog = null;
        }

        state.blogStatus = "succeeded";
      })

      // ================= REVIEWS =================
      .addCase(fetchReview.pending, (state) => {
        state.reviewStatus = "loading";
      })
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.reviewStatus = "succeeded";
        state.review = action.payload.reviews || [];
      })
      .addCase(fetchReview.rejected, (state, action) => {
        state.reviewStatus = "failed";
        state.error = action.payload;
      })

      .addCase(fetchReviewPost.fulfilled, (state, action) => {
        state.reviewStatus = "succeeded";
        if (action.payload.review) {
          state.review.unshift(action.payload.review);
        }
      })

      .addCase(fetchReviewDelete.fulfilled, (state, action) => {
        const { reviewId } = action.payload;
        state.review = state.review.filter((r) => r._id !== reviewId);
        state.reviewStatus = "succeeded";
      })

      // ================= LIKE =================
      .addCase(fetchLike.fulfilled, (state, action) => {
        const { blogId, liked, userId } = action.payload;

        if (state.currentBlog?._id === blogId) {
          state.currentBlog.like = liked
            ? [...new Set([...state.currentBlog.like, userId])]
            : state.currentBlog.like.filter((id) => id !== userId);
        }

        state.blog = state.blog.map((b) =>
          b._id === blogId
            ? {
                ...b,
                like: liked
                  ? [...new Set([...b.like, userId])]
                  : b.like.filter((id) => id !== userId),
              }
            : b
        );

        state.likeStatus = "succeeded";
      })

      // ================= FOLLOW =================
      .addCase(fetchFollowData.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(fetchFollowData.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        state.followers = action.payload.user?.followers || [];
        state.following = action.payload.user?.following || [];
      })
      .addCase(fetchFollowData.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUploadPercent } = blogSlice.actions;
export default blogSlice.reducer;
