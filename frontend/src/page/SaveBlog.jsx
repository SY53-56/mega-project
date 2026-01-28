import {  useSelector } from "react-redux";
import BlogCard from "../component/BlogCard";

export default function SaveBlog() {
  const { user, status } = useSelector(state => state.auth);
console.log("saveBlogs raw:", user.saveBlogs);

  if (status === "loading" || status === "idle") {
    return <p className="text-center mt-10">Loading saved blogs...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Please login</p>;
  }

  if (!user.saveBlogs || user.saveBlogs.length === 0) {
    return <p className="text-center mt-10">No saved blogs yet</p>;
  }

  // 🔥 Filter only populated blogs
  const populatedBlogs = user.saveBlogs.filter(
    blog => typeof blog === "object" && blog?._id
  );

  if (populatedBlogs.length === 0) {
    return <p className="text-center mt-10">Loading saved blogs...</p>;
  }

  return (
    <div className="w-full px-10">
      <h1 className="text-4xl text-center font-bold mt-10">Saved Blogs</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {populatedBlogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
