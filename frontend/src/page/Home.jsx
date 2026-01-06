import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetData } from "../features/BlogThunk";
import BlogCard from "../component/BlogCard"

export default function Home() {
  const dispatch = useDispatch();
  const { blog, status, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchGetData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-6 py-12">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Sahul Yadav Blogs
        </h1>
        <p className="text-gray-500 mt-3">
          Thoughts, stories & ideas worth sharing ✨
        </p>
      </div>

      {/* States */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading blogs...</p>
      )}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Blog Grid */}
      {Array.isArray(blog) && blog.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blog.map((item) => (
            <BlogCard key={item._id} blog={item} />
          ))}
        </div>
      ) : (
        status !== "loading" && (
          <p className="text-center text-gray-500 mt-10">
            No blogs found.
          </p>
        )
      )}
    </div>
  );
}
