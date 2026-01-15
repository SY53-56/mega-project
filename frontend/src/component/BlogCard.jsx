import { Link } from "react-router-dom";
import { BookMarkedIcon, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetSingleBlog, fetchLike } from "../features/BlogThunk";
import { memo, useCallback} from "react";
import { fetchSaveBlog } from "../features/authThunk";
const BlogCard = memo(function BlogCard({ blog }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log("blog",blog)
  // ✅ Like check
  const isLike = user
    ? blog?.like?.includes(user._id)
    : false;

  // ✅ Save check (FIXED)
 // ✅ Save check (FIXED PROPERLY)
// ✅ Save check (FIXED PROPERLY)
const isSaved = user?.saveBlogs?.some(blogObj => blogObj._id === blog._id) || false;




console.log("user",isSaved)
console.log("userbbdadf",user)
  // ✅ Like handler
  const handleLike = useCallback(() => {
    if (!user) return alert("Login first");

    dispatch(fetchLike(blog._id))
      .then(() => dispatch(fetchGetSingleBlog(blog._id)));
  }, [dispatch, blog._id, user]);

  // ✅ Save handler (NO NAVIGATION)
  const handleSave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return alert("Login first");

    dispatch(fetchSaveBlog(blog._id))
    .then(()=>  alert("blog saved"))
  
  }, [dispatch, user, blog._id]);

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">

      {/* IMAGE SECTION */}
      <div className="relative overflow-hidden">
        <Link to={`/userpage/${blog._id}`}>
          <img
            src={blog.image?.[0]}
            alt={blog.title}
            className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
          />
        </Link>

        {/* SAVE BUTTON */}
      <button
  onClick={handleSave} // pass event properly
  className="absolute top-3 right-3 cursor-pointer z-20 opacity-0 group-hover:opacity-75 bg-white/90 hover:bg-gray-300 p-2 rounded-md shadow-md transition-all duration-300"
>
  {isSaved ? "Saved" : "Save"}
</button>


        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-90 pointer-events-none" />

        {/* TITLE */}
        <Link to={`/userpage/${blog._id}`}>
          <h2 className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold line-clamp-2">
            {blog.title}
          </h2>
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col gap-3">

        {/* AUTHOR */}
        <div className="flex items-center gap-3">
          <img
            src={blog.author?.image || "https://via.placeholder.com/150"}
            alt="author"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {blog.author?.username || "Unknown"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {blog.description}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-3">
          <Link
            to={`/userpage/${blog._id}`}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Read more →
          </Link>

          <div className="flex items-center gap-1">
            <Heart
              size={16}
              onClick={handleLike}
              className={`cursor-pointer active:scale-90 ${
                isLike ? "text-red-500" : "text-gray-700"
              }`}
            />
            <span className="text-sm">{blog.like?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default BlogCard;
