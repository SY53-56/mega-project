import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import  {fetchUserAccount}  from "../features/BlogThunk";
import { Link, useParams } from "react-router-dom";
import Button from "../component/Button";
import BlogCard from "../component/BlogCard";

export default function UserAccount() {
  const dispatch = useDispatch();
  const { id } = useParams(); // user ID from route params

  const { blog, userProfile, userBlog, status, error } = useSelector((state) => state.blog);
  const authUser = useSelector((state) => state.auth.user); // currently logged-in user
  //const {user} =  useSelector((state) => state.auth.user)

console.log( "userPro",userProfile)
console.log("userBlog",userBlog)
  useEffect(() => {
    if (id) dispatch(fetchUserAccount(id));
  }, [dispatch, id]);

  console.log("bloguser", blog)
  // handle loading + error
  if (status === "loading") {
    return <div className="text-center mt-10 text-gray-600">Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center mt-10 text-gray-500">User not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* -------- Left Panel: Author Info -------- */}
        <div className="bg-white p-6 rounded-xl shadow-md flex h-[400px] flex-col items-center">
          <img
            src={
              userProfile.image ||
              "https://plus.unsplash.com/premium_photo-1761211108987-c37052604d95?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1915"
            }
            alt={userProfile.username}
            className="w-32 h-32 bg-amber-400 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{userProfile.username}</h2>
          <p className="text-gray-500 mb-2">{userProfile.email}</p>

          {/* Show edit button only if this profile belongs to the logged-in user */}
          {authUser?._id === userProfile._id && (
            <Button
              name="Edit Profile"
              className="bg-indigo-600 active:scale-95 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-4"
            />
          )}

          <div className="flex gap-3">
           <div className="flex flex-col items-center"> 
            <Button className="" name="followers"/>
            <h1>{userProfile?.followers?.length ||0}</h1>

           </div>
               <div className="flex flex-col items-center">
                <Button className="" name="following"/>
                <h1>{ userProfile?.following?.length||0}</h1>
               </div>
          </div>
        </div>

        {/* -------- Right Panel: User's Posts -------- */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-4">Posts by {userProfile.username}</h1>

          {userBlog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userBlog.map((post) => (
                 <BlogCard blog={post}/>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 col-span-full">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
