import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

import {
  fetchDelete,
  fetchGetSingleBlog,
  fetchLike,
  fetchReview,
  fetchReviewDelete,
  fetchReviewPost,
} from "../features/BlogThunk";

import Button from "../component/Button";
import { followUser } from "../features/authThunk";

export default function UserPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [imgIndex, setImgIndex] = useState(0);
  const [comment, setComment] = useState("");

  const { currentBlog, status, error, review } = useSelector(
    (state) => state.blog
  );
  const { user } = useSelector((state) => state.auth);
console.log("review",review)
  const authorId = currentBlog?.author?._id
  const imageLength = currentBlog?.image?.length || 0;
 console.log("gdfd",authorId)
 console.log(user)
 let userId = user?.id || user?._id
  const isFollowing = user?.following?.includes(authorId);
const isLiked = currentBlog?.like
  ?.map(id => id)
  ?.includes(user?._id);

console.log("current",currentBlog)
  /* ================= FOLLOW ================= */
  const followedButton = () => {
    if (!user) return alert("Please login");
    if (userId=== authorId) return alert("You cannot follow yourself");

    dispatch(followUser(authorId));
  };

  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    if (!id) return;
    dispatch(fetchGetSingleBlog(id));
    dispatch(fetchReview(id));
  }, [id, dispatch]);

  /* ================= AUTO SLIDER (FIXED) ================= */
  useEffect(() => {
    if (imageLength <= 1) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev === imageLength - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [imageLength]);

  /* ================= MANUAL SLIDER ================= */
  const nextImage = useCallback(() => {
    setImgIndex((prev) => (prev === imageLength - 1 ? 0 : prev + 1));
  }, [imageLength]);

  const prevImage = useCallback(() => {
    setImgIndex((prev) => (prev === 0 ? imageLength - 1 : prev - 1));
  }, [imageLength]);

  /* ================= DELETE BLOG ================= */
  const deleteBlog = () => {
    dispatch(fetchDelete(id))
      .unwrap()
      .then(() => navigate("/"));
  };

  /* ================= POST COMMENT ================= */
  const handleReviewForm = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    dispatch(fetchReviewPost({ blogId: id, reviewData: { comment } }))
      .unwrap()
      .then(() => {
        setComment("");
        dispatch(fetchReview(id));
      });
  };

  /* ================= DELETE COMMENT ================= */
  const deleteReview = (reviewId, reviewUserId) => {
    if (user?._id !== reviewUserId) return;

    dispatch(fetchReviewDelete(reviewId))
      .unwrap()
      .then(() => dispatch(fetchReview(id)));
  };
 
  function handleLike(){
     if (!user) return alert("Please login to like this blog");
    dispatch(fetchLike(currentBlog?._id)).unwrap()
    .then(()=>dispatch(fetchGetSingleBlog(currentBlog._id)))
  }

  const isAuthor =     userId === authorId  
  console.log("isauthor",isAuthor)            // user && authorId&& String(user.id)===String(authorId)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Blog Details
        </h1>

        {status === "loading" && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {currentBlog && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* IMAGE SLIDER */}
            <div className="relative">
              <img
                src={currentBlog.image?.[imgIndex]}
                alt="blog"
                className="w-full h-[260px] lg:h-[520px] object-cover"
              />

              {imageLength > 1 && (
                <>
                  <ArrowLeft
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 w-9 h-9 p-2 bg-black/50 text-white rounded-full cursor-pointer"
                  />
                  <ArrowRight
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 w-9 h-9 p-2 bg-black/50 text-white rounded-full cursor-pointer"
                  />
                </>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-8 flex-col">
              <div className="w-full  items-center justify-between lg:flex gap-8 mb-6">
                <div className="flex items-center gap-4">
                <Link to={`/user/${authorId}/blogs`}>
                  <img
                    src={currentBlog.author?.image || "https://via.placeholder.com/150"}
                    className=" w-16 lg:w-20 h-12 rounded-full object-cover"
                  />
                </Link>
                <div className=" w-full">
                  
                    <p className="text-sm text-gray-500">Author</p>
                    <h3 className="font-semibold text-lg">
                      {currentBlog.author?.username}
                    </h3>
                  </div>
                  </div>
                  <div className="flex gap-16 mt-8">
                    <div className="flex  justify-center gap-2 items-center">
                      <button
                      onClick={handleLike}
                      className={`flex items-center cursor-pointer gap-1 px-3 py-1 rounded-full ${isLiked ? "bg-red-200" : "bg-gray-100"}`}
                    >
                      <Heart size={18} className={`transition ${isLiked ? "text-red-500 full-red-500" : "text-gray-500"}`} />
                    </button>
                             <span>{currentBlog.like?.length || 0}</span>
                    </div>
                    <Button
                      onClick={followedButton}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg"
                      name={isFollowing ? "Unfollow" : "Follow"}
                    />
                  </div>
               
              </div>

              <h2 className="text-3xl font-bold">{currentBlog.title}</h2>
              <p className="mt-4 text-gray-700">{currentBlog.description}</p>

              {isAuthor && (
                <div className="flex gap-3 mt-6">
                  <Button
                    to={`/userUpdate/${id}`}
                    className="bg-blue-500 text-white"
                    name="EditBlog"
                  />
                  <Button
                    onClick={deleteBlog}
                    className="bg-red-600 text-white"
                    name="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENTS */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Comments ({review.length})
          </h3>

          <form onSubmit={handleReviewForm} className="flex gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Write your comment..."
            />
            <button className="bg-indigo-500 hover:bg-indigo-600  text-white px-5 cursor-pointer rounded-md transition-all duration-500">
              Post
            </button>
          </form>

       <div className="mt-6 space-y-4">
  {review.map((rev) => (
    <div
      key={rev._id}
      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      {/* USER INFO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/user/${rev.user._id}/blogs`}>
            <img
              src={rev?.user?.image}
              alt="user"
              className="w-11 h-11 rounded-full object-cover cursor-pointer"
            />
          </Link>

          <div>
            <p className="font-semibold text-gray-800">
              {rev.user.username}
            </p>
            <p className="text-xs text-gray-400">
              Just now
            </p>
          </div>
        </div>

        {userId === rev?.user?._id && (
          <button
            onClick={() => deleteReview(rev._id)}
            className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-full transition"
          >
            Delete
          </button>
        )}
      </div>

      {/* COMMENT */}
      <div className="mt-3 ml-14">
        <p className="text-gray-700 leading-relaxed">
          {rev.comment}
        </p>
      </div>
    </div>
  ))}
</div>

        </div>

      </div>
    </div>
  );
}
