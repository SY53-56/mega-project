import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetData } from "../features/blogSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { blog, status, error } = useSelector((state) => state.blog);

  // Fetch blogs on mount
  useEffect(() => {
    dispatch(fetchGetData());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold bg-amber-600 text-white p-4 mb-4">
        Sahul Yadav
      </h1>

      {status === "loading" && <p className="text-gray-300">Loading blogs...</p>}

      {error && <p className="text-red-500">Error: {error}</p>}

      {Array.isArray(blog) && blog.length > 0 ? (
        <ul className="list-disc ml-6 space-y-1">
          {blog.map((item) => (
            <li key={item.id || item.title}>{item.title}</li>
          ))}
        </ul>
      ) : (
        status !== "loading" && <p className="text-gray-300">No blogs found.</p>
      )}
    </div>
  );
}
