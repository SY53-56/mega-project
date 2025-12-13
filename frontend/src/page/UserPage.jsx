import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchDelete,
  fetchGetSingleBlog,
  fetchReview,
  fetchReviewDelete,
  fetchReviewPost,
} from "../features/blogSlice";
import Button from "../component/Button";

export default function UserPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const { currentBlog, error, status, review } = useSelector(
    (state) => state.blog
  );
  const { token, user } = useSelector((state) => state.auth);

  // ✅ Load single blog and its reviews
  useEffect(() => {
    if (id) {
      dispatch(fetchGetSingleBlog(id));
      dispatch(fetchReview(id));
    }
  }, [id, dispatch]);

  // ✅ Delete blog (only if blog author)
  const deleteBlog = () => {
    if (id) {
      dispatch(fetchDelete(id))
        .unwrap()
        .then(() => navigate("/"))
        .catch((err) => console.error("Error deleting blog:", err));
    }
  };

  // ✅ Post a new comment
  const handleReviewForm = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please enter a comment");

    dispatch(fetchReviewPost({ blogId: id, reviewData:{ comment} }))
      .unwrap()
      .then(() => {
        setComment("");
        dispatch(fetchReview(id)); // refresh after posting
      })
      .catch((err) => console.error("Error posting review:", err));
  };

  // ✅ Delete comment (only if current user === comment author)
  const deleteReview = (reviewId, reviewUserId) => {
    if (!reviewId) return;

    if (user?._id !== reviewUserId) {
      alert("You can only delete your own comment!");
      return;
    }

    dispatch(fetchReviewDelete(reviewId))
      .unwrap()
      .then(() => dispatch(fetchReview(id))) // refresh comments
      .catch((err) => console.error("Error deleting review:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Blog Details
        </h1>

        {/* Loading State */}
        {status === "loading" && (
          <p className="text-center text-gray-500 text-lg">Loading blog...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 text-lg font-medium">
            {error}
          </p>
        )}

        {/* Blog Display */}
        {currentBlog ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
            {/* Blog Image */}
            {currentBlog.image && (
              <img
                src={currentBlog.image[0]}
                alt={currentBlog.title || "Blog image"}
                className="w-full h-[500px] object-cover"
              />
            )}

            {/* Blog Details */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {currentBlog.title}
              </h2>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {currentBlog.description}
              </p>

              {/* Author Section */}
              <div className="flex items-center justify-between mt-8 border-t pt-6">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      currentBlog.author?.img ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={currentBlog.author?.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {currentBlog.author?.username}
                    </p>
                    <Link
                      to={`/user/${currentBlog.author?._id}/blogs`}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      View more posts
                    </Link>
                  </div>
                </div>

                {/* Edit/Delete Buttons */}
                {token && user?._id === currentBlog?.author?._id && (
                  <div className="flex gap-3">
                    <Button
                      to={`/userUpdate/${currentBlog?._id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg"
                      name="Edit"
                    />
                    <Button
                      onClick={deleteBlog}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg"
                      name="Delete"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          status === "succeeded" && (
            <p className="text-center text-gray-500 text-lg mt-10">
              No blog found.
            </p>
          )
        )}

        {/* 📝 Comment Form */}
        <div className="bg-white mt-10 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Leave a Comment
          </h3>
          <form onSubmit={handleReviewForm} className="flex gap-3 items-center">
            <input
              type="text"
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your thoughts..."
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition"
            >
              Post
            </button>
          </form>
        </div>

        {/* 💬 Display All Comments */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Comments ({review?.length || 0})
          </h3>

          {review && review.length > 0 ? (
            <div className="space-y-4">
              {review.map((rev) => (
                <div
                  key={rev._id}
                  className="border-b border-gray-200 pb-3 flex justify-between gap-4"
                >
                  <div className="flex gap-5">
                    <img
                      src={
                        rev.user?.img ||
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {rev.user?.username || "Anonymous"}
                      </p>
                      <p className="text-gray-600">{rev.comment}</p>
                    </div>
                  </div>

                  {/* ✅ Only author of comment can delete */}
                  {token && user?._id === rev.user?._id && (
                    <Button
                      onClick={() => deleteReview(rev._id, rev.user._id)}
                      className="text-white px-5 py-1 rounded-2xl bg-red-500 hover:bg-red-600"
                      name="Delete"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
