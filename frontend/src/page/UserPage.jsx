import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  const [imgIndex, setImgIndex] = useState(0);
  const [comment, setComment] = useState("");

  const { currentBlog, status, error, review } = useSelector(
    (state) => state.blog
  );
  const { token, user } = useSelector((state) => state.auth);

  /* ================= FETCH BLOG & REVIEWS ================= */
  useEffect(() => {
    if (!id) return;
    dispatch(fetchGetSingleBlog(id));
    dispatch(fetchReview(id));
  }, [id, dispatch]);

  /* ================= AUTO IMAGE SLIDER ================= */
  useEffect(() => {
    if (!currentBlog?.image || currentBlog.image.length <= 1) return;

    const interval = setInterval(() => {
      setImgIndex((prev) =>
        prev === currentBlog.image.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [currentBlog?.image?.length]);

  /* ================= MANUAL SLIDER ================= */
  const nextImage = useCallback(() => {
    if (!currentBlog?.image || currentBlog.image.length <= 1) return;
    setImgIndex((prev) =>
      prev === currentBlog.image.length - 1 ? 0 : prev + 1
    );
  }, [currentBlog?.image?.length]);

  const prevImage = useCallback(() => {
    if (!currentBlog?.image || currentBlog.image.length <= 1) return;
    setImgIndex((prev) =>
      prev === 0 ? currentBlog.image.length - 1 : prev - 1
    );
  }, [currentBlog?.image?.length]);

  /* ================= DELETE BLOG ================= */
  const deleteBlog = () => {
    if (!id) return;
    dispatch(fetchDelete(id))
      .unwrap()
      .then(() => navigate("/"))
      .catch(console.error);
  };

  /* ================= POST COMMENT ================= */
  const handleReviewForm = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please enter a comment");

    dispatch(fetchReviewPost({ blogId: id, reviewData: { comment } }))
      .unwrap()
      .then(() => {
        setComment("");
        dispatch(fetchReview(id));
      })
      .catch(console.error);
  };

  /* ================= DELETE COMMENT ================= */
  const deleteReview = (reviewId, reviewUserId) => {
    if (user?.id !== reviewUserId) {
      alert("You can only delete your own comment!");
      return;
    }

    dispatch(fetchReviewDelete(reviewId))
      .unwrap()
      .then(() => dispatch(fetchReview(id)))
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Blog Details
        </h1>

        {status === "loading" && (
          <p className="text-center">Loading blog...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {currentBlog && (
          <div className="bg-white rounded-2xl shadow-lg relative overflow-hidden">

            {/* BLOG IMAGE */}
            <img
              src={currentBlog.image?.[imgIndex]}
              alt="blog"
              className="w-full h-[250px] lg:h-[500px] object-cover"
            />

            {/* SLIDER CONTROLS */}
            {currentBlog.image?.length > 1 && (
              <>
                <ArrowLeft
                  onClick={prevImage}
                  className="absolute top-1/2 left-4 text-white bg-black/40 rounded-full cursor-pointer"
                />
                <ArrowRight
                  onClick={nextImage}
                  className="absolute top-1/2 right-4 text-white bg-black/40 rounded-full cursor-pointer"
                />
              </>
            )}

            <div className="p-8">
              {/* AUTHOR */}
              <div className="flex gap-3 items-center mb-4">
                <Link to={`/user/${currentBlog.author?._id}/blogs`}>
                  <img
                    src={
                      currentBlog.author?.img ||
                      "https://via.placeholder.com/150"
                    }
                    alt="author"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>

                <h1 className="text-lg">
                  Author:
                  <strong className="ml-1">
                    {currentBlog.author?.username}
                  </strong>
                </h1>
              </div>

              <h2 className="text-3xl font-bold">
                {currentBlog.title}
              </h2>

              <p className="mt-4 text-gray-700">
                {currentBlog.description}
              </p>

              {/* EDIT / DELETE */}
              {token && user?.id === currentBlog.author?._id && (
                <div className="flex gap-3 mt-6">
                  <Button
                    to={`/userUpdate/${currentBlog._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    name="Edit"
                  />
                  <Button
                    onClick={deleteBlog}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    name="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENTS */}
        <div className="bg-white mt-10 p-6 rounded-xl shadow">
          <form onSubmit={handleReviewForm} className="flex flex-col gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded w-full px-3 py-2"
              placeholder="Write a comment..."
            />
            <button className="bg-indigo-600 text-white px-5 py-1 rounded hover:bg-indigo-700">
              Post
            </button>
          </form>

          <div className="mt-6">
            {review?.map((rev) => (
              <div
                key={rev._id}
                className="flex justify-between border-b py-3"
              >
                <p>{rev.comment}</p>
                {user?.id === rev.user?._id && (
                  <button
                    onClick={() =>
                      deleteReview(rev._id, rev.user._id)
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
