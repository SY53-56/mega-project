import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetSingleBlog, fetchLike } from "../features/BlogThunk";
import { memo, useCallback } from "react";

 const BlogCard = memo(function BlogCard({ blog }) {
   const dispatch = useDispatch()
   const {user}  =  useSelector(state=>state.auth)
   const {blogs} = useSelector(state =>state.blog)
   console.log("ggdhhjhfgdj",user)
   console.log("blpog",blog)
   console.log("data",blogs)
 let isLike = user?blog?.like.map(d=>d).includes(user._id):false
const handlike = useCallback(()=>{
  if(!user)return alert("login first")
         dispatch(fetchLike(blog._id))
         .then(()=>fetchGetSingleBlog(blog._id))
   
   },[dispatch,blog._id,user])

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">

      {/* Image */}
      <Link to={`/userpage/${blog._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={blog.image?.[0]}
            alt={blog.title}
            className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-90" />

          {/* Title on image */}
          <h2 className="absolute bottom-4 left-4 right-4 text-white text-xl font-bold line-clamp-2">
            {blog.title}
          </h2>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={blog.author?.img || "https://via.placeholder.com/150"}
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

        {/* Description preview */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {blog.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-3">
          <Link
            to={`/userpage/${blog._id}`}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Read more →
          </Link>

          <div className={`flex items-center gap-1  text-gray-500`}>
            <Heart size={16} onClick={handlike} className={`${isLike?"text-red-500 ":"text-gray-700"} cursor-pointer active:scale-90`}/>
            <span className="text-sm">{blog.like?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
})
export default BlogCard