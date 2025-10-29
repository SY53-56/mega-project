// page/UserPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams,Link } from "react-router-dom";
import { fetchDelete, fetchGetSingleBlog } from "../features/blogSlice";
import Button from "../component/Button";

export default function UserPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
const navigate= useNavigate()
  const { currentBlog, error, status,blog } = useSelector((state) => state.blog);
  const {token , user} = useSelector(state=>state.auth)
  console.log("blog :", blog)
  console.log( "user", user)
console.log(currentBlog)
console.log("token",token)
  useEffect(() => {
    if (id) dispatch(fetchGetSingleBlog(id))
  }, [id, dispatch]);

  function deleteBlog(){
  if(id)dispatch(fetchDelete(id))
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Blogs by User <span className="text-indigo-600">{id}</span>
      </h1>

      {/* Loading */}
      {status === "loading" && (
        <p className="text-center text-gray-500 text-lg">Loading blogs...</p>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Blog Card */}
      {currentBlog ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 ml-14 lg:grid-cols-3 gap-6">
          <div className="bg-white py-2 px-3 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden">
            
            {/* Blog Image */}
            {currentBlog.image && (
              <img
                src={currentBlog.image}
                alt={currentBlog.title || "Blog image"}
                className="w-full h-h-full object-cover"
              />
            )}

            {/* Blog Content */}
            <div className="p-5 text-left">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
               <span className="font-bold text-1.5xl ">title:</span>  {currentBlog.title}
              </h2>
              <p className="text-gray-500 mb-4"><span className="font-bold text-1.5xl text-black">Description:</span> {currentBlog.description}</p>
  <p className="cursor-pointer">
  <span className="font-bold text-xl">Author:</span>{" "}
  <Link 
    to={`/user/${currentBlog.author._id}/blogs`} 
    className="text-blue-600 hover:underline"
  >
    {currentBlog.author.username}
  </Link>
</p>

             {token && user?.id === currentBlog?.author?._id &&(
               <div className="flex gap-5 mt-3">
              <Button to={`/userUpdate/${currentBlog._id}`} className="bg-sky-600 hover:bg-sky-700 font-bold text-white" name="Updata"/>
                <Button  onClick={deleteBlog} className="bg-red-600 hover:bg-red-700 font-bold text-white" name="Delete"/>
              </div>
             )}
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        status === "succeeded" && (
          <p className="text-center text-gray-500 text-lg mt-10">
            No blogs found for this user.
          </p>
        )
      )}
    </div>
  );
}
