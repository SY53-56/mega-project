import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetData } from "../features/BlogThunk";
import BlogCard from "../component/BlogCard";
import { fetchMe } from "../features/authThunk";

export default function Home() {
  const dispatch = useDispatch();
  const { blog, status, error } = useSelector((state) => state.blog);
  const {user} = useSelector(state=>state.auth)
const [filters ,setFilters] =useState("all")
 
console.log(user)
const filtersData = Array.isArray(blog)
  ? blog.filter((items) => {
      let blogDate = new Date(items.createdAt);
      let today = new Date();

      if (filters === "today") {
        return today.toDateString() === blogDate.toDateString();
      }

      if (filters === "7days") {
        return (today - blogDate) / (1000 * 60 * 60 * 24) <= 7;
      }

      if (filters === "30days") {
        return (today - blogDate) / (1000 * 60 * 60 * 24) <= 30;
      }

      return true;
    })
  : [];

  useEffect(() => {
    dispatch(fetchGetData())
    dispatch(fetchMe())
  }, [dispatch]);

  useEffect(()=>{

console.log("user",user)
  },[user])


  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10">

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
         {user?( <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {user.username}
          </h1>):(<h1 className="text-4xl md:text-5xl font-bold text-gray-900">hello</h1>)}
          <p className="text-gray-500 mt-2 text-base md:text-lg">
            Blogs, thoughts & ideas worth sharing
          </p>
        </div>
     <img
  src={user?.image}
  alt="profile"
  onError={(e) => {
    console.log("IMAGE FAILED:", e.target.src);
    e.target.src = "https://via.placeholder.com/600x400";
  }}
/>

        {/* FILTER UI */}
        <div className="bg-white shadow-lg border rounded-lg px-4 py-3 w-full md:w-60">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            FILTER BY DATE
          </label>
          <select value={filters} onChange={(e)=>setFilters(e.target.value)} className="w-full text-sm  border-none cursor-pointer  focus:ring-0 focus:outline-none text-gray-700">
            <option  value="all">All blogs</option>
            <option  value="today">Today</option>
            <option  value="7days">Last 7 days</option>
            <option  value="30days">Last 30 days</option>
         
          </select>
        </div>
      </div>

      {/* STATES */}
      {status === "loading" && (
        <p className="text-center text-gray-500">Loading blogs...</p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* BLOG GRID */}
      {Array.isArray(blog) && blog.length > 0 ? (
        <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtersData.map((item) => (
            <BlogCard key={item._id} blog={item} />
          ))}
        </div>
      ) : (
        status !== "loading" && (
          <p className="text-center text-gray-400 mt-20">
            No blogs found.
          </p>
        )
      )}
    </div>
  );
}
