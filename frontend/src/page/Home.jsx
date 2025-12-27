import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetData } from "../features/BlogThunk"

import { Link } from "react-router-dom";
export default function Home() {
  const dispatch = useDispatch();
  const { blog, status, error } = useSelector((state) => state.blog);
  const {user} = useSelector((state)=>state.auth)
  console.log( "blog data blog",blog)
   console.log( "user data blog",user)

  // Fetch blogs on mount
  useEffect(() => {
    dispatch(fetchGetData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-5xl font-bold bg-amber-500 text-white px-8 py-4 rounded-lg shadow-lg mb-8">
        Sahul Yadav Blogs
      </h1>

      {/* Loading & Error */}
      {status === "loading" && <p className="text-gray-500 text-lg mb-4">Loading blogs...</p>}
      {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

      {/* Blog List */}
      {Array.isArray(blog) && blog.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {blog.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center px-1 py-2 hover:scale-105 transition-transform duration-300"
            >
              {item.image && (
               <Link to={`/userpage/${item._id}`}>
               <img className="w-[250px ] lg:w-[350px] h-[190px] lg:h-[290px] rounded-lg object-cover" src={item.image[0]} alt={item.title} />
               </Link>
              )}
              <div className="p-4 flex flex-col items-center text-left ">
                <h2 className="text-[20px] lg:text-2xl font-bold text-gray-800 mb-2 text-left">title: {item.title}</h2>
      <p className="text-sm text-gray-500">Author: <strong>{item.author?.username || "Unknown"}</strong></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        status !== "loading" && <p className="text-gray-500 text-lg mt-4">No blogs found.</p>
      )}
    </div>
  );
}
