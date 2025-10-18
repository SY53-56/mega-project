import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchUserAccount } from '../features/blogSlice'

export default function UserPage() {
  const{currentBlog,error , status}= useSelector(state=>state.blog)
    const dispatch =useDispatch()
    const {id} = useParams()
  useEffect(()=>{
    if(id){
      dispatch(fetchUserAccount(id))
    }
  },[id,dispatch])
  return (
 
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Blogs by User {id}
      </h1>

      {status === "loading" && <p>Loading blogs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(currentBlog) && currentBlog.length > 0 ? (
        <ul className="space-y-4">
          {currentBlog.map((blog) => (
          <li
  key={blog._id}
  className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
>
  <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
  <p className="text-gray-500">{blog.description?.slice(0, 120)}...</p>
  {blog.image && (
    <img
      src={blog.image}
      alt={blog.title}
      className="mt-2 w-full h-48 object-cover rounded-lg"
    />
  )}
</li>

          ))}
        </ul>
      ) : (
        status !== "loading" && <p>No blogs found for this user.</p>
      )}
    </div>
  );
}

  
