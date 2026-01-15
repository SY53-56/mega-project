import { useSelector } from "react-redux";
import BlogCard from "../component/BlogCard";

export default function SaveBlog() {
  const { user } = useSelector(state => state.auth);



  if (!user?.saveBlogs?.length) {
    return <p className="text-center mt-10">No saved blogs yet</p>;
  }

  return (
    <div className="w-full px-10">
      <h1 className="text-4xl text-center font-bold mt-10">
        Saved Blogs
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {user.saveBlogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
