import  { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  fetchDelete,
  fetchGetSingleBlog,
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
    (state) => state.blog);
  const {  user } = useSelector((state) => state.auth);
  
const authorId = currentBlog?.author?._id;

const isFollowing = user?.following?.includes(authorId);

const followedButton = () => {
  if (!user) return alert("Please login");
  if (user._id === authorId) return alert("You cannot follow yourself");

  dispatch(followUser(authorId));
};

useEffect(() => {
  console.log("Current user state 👉", user);
 
}, [user]); // only runs when user or token changes





  /* ================= FETCH BLOG ================= */
  useEffect(() => {
    if (!id) return;
    dispatch(fetchGetSingleBlog(id));
    dispatch(fetchReview(id));
  }, [id, dispatch]);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!currentBlog?.image || currentBlog.image.length <= 1) return;

    const interval = setInterval(() => {
      setImgIndex((prev) =>
        prev === currentBlog.image.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [currentBlog?.image?.length, setImgIndex , currentBlog]);

  /* ================= MANUAL SLIDER ================= */
  const nextImage = useCallback(() => {
    setImgIndex((prev) =>
      prev === currentBlog.image.length - 1 ? 0 : prev + 1
    );
  }, [currentBlog?.image?.length]);

  const prevImage = useCallback(() => {
    setImgIndex((prev) =>
      prev === 0 ? currentBlog.image.length - 1 : prev - 1
    );
  }, [currentBlog?.image?.length]);

  /* ================= DELETE BLOG ================= */
  const deleteBlog = () => {
    dispatch(fetchDelete(id))
      .unwrap()
      .then(() => navigate("/"))
      .catch(console.error);
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
    if (user?.id !== reviewUserId) return;
    dispatch(fetchReviewDelete(reviewId))
      .unwrap()
      .then(() => dispatch(fetchReview(id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
          Blog Details
        </h1>

        {status === "loading" && (
          <p className="text-center text-gray-600">Loading...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {currentBlog && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* IMAGE SLIDER */}
            <div className="relative">
              <img
                src={currentBlog.image?.[imgIndex]}
                alt="blog"
                className="w-full h-[260px] lg:h-[520px] object-cover"
              />

              {currentBlog.image?.length > 1 && (
                <>
                  <ArrowLeft
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 w-9 h-9 p-2 bg-black/50 text-white rounded-full cursor-pointer hover:bg-black"
                  />
                  <ArrowRight
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 w-9 h-9 p-2 bg-black/50 text-white rounded-full cursor-pointer hover:bg-black"
                  />
                </>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-8">
              {/* AUTHOR */}
              <div className="flex items-center gap-4 mb-6">
                <Link to={`/user/${currentBlog.author?._id}/blogs`}>
                  <img
                    src={
                      currentBlog.author?.img ||
                      "https://via.placeholder.com/150"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>

                <div className="flex justify-between w-full">
                 <div>
                   <p className="text-sm text-gray-500">Author</p>
                  <h3 className="font-semibold text-lg">
                    {currentBlog.author?.username}
                  </h3>
                 </div>
                   <Button onClick={followedButton}className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"   name={isFollowing ? "Unfollow" : "Follow"}/>
                 </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800">
                {currentBlog.title}
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {currentBlog.description}
              </p>

              {/* ACTIONS */}
              {user?.id === currentBlog.author?._id && (
                <div className="flex gap-3 mt-6">
                 <Button
  onClick={followedButton}
  className={`px-4 py-1 text-white ${
    isFollowing ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
  }`}
   name={isFollowing ? "Unfollow" : "Follow"}
/>

                  <Button
                    onClick={deleteBlog}
                    className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
                    name="Delete"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* COMMENTS */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          <form onSubmit={handleReviewForm} className="flex gap-3">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your comment..."
            />
            <button className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700">
              Post
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {review?.map((rev) => (
              <div
                key={rev._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <p className="text-gray-700">{rev.comment}</p>

                {user?.id === rev.user?._id && (
                  <button
                    onClick={() =>
                      deleteReview(rev._id, rev.user._id)
                    }
                    className="text-sm text-red-500 hover:underline"
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
