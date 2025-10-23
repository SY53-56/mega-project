import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAccount } from "../features/blogSlice";
import Button from "../component/Button";
import { Link } from "react-router-dom";

export default function UserAccount() {
  const dispatch = useDispatch();
  const { blog, status, error } = useSelector((state) => state.blog);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) dispatch(fetchUserAccount(user.id));
  }, [dispatch, user?.id]);

  const userPosts = blog?.filter((post) => post.author._id === user.id) || [];

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* -------- Left Panel: User Info -------- */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <img
            src={user?.img || "https://via.placeholder.com/150"}
            alt={user?.username}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{user?.username}</h2>
          <p className="text-gray-500 mb-2">{user?.email}</p>
          <Button
            name="Edit Profile"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-4"
          />
        </div>

        {/* -------- Right Panel: User's Posts -------- */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-4">My Posts</h1>

          {status === "loading" && <p className="text-gray-500">Loading posts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-4 h-96 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  {post.image && (
                    <Link to={`/userpage/${post._id}`}>
                      <img
                        className="w-full  object-cover rounded-lg mb-3"
                        src={post.image}
                        alt={post.title}
                      />
                    </Link>
                  )}
                  <h2 className="text-xl font-semibold mb-1">
                    <span className="font-bold">Title:</span> {post.title}
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold">Description:</span>{" "}
                    {post.description.slice(0, 100)}...
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
