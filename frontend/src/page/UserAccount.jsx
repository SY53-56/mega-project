import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAccount } from "../features/blogSlice";
import { Link, useParams } from "react-router-dom";
import Button from "../component/Button";

export default function UserAccount() {
  const dispatch = useDispatch();
  const { id } = useParams(); // user ID from route params

  const { blog, user, status, error } = useSelector((state) => state.blog);
  const authUser = useSelector((state) => state.auth.user); // currently logged-in user
console.log("user",user)
console.log("blogs",blog)
  useEffect(() => {
    if (id) dispatch(fetchUserAccount(id));
  }, [dispatch, id]);

  // handle loading + error
  if (status === "loading") {
    return <div className="text-center mt-10 text-gray-600">Loading user profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-gray-500">User not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* -------- Left Panel: Author Info -------- */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <img
            src={
              user.img ||
              "https://plus.unsplash.com/premium_photo-1761211108987-c37052604d95?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1915"
            }
            alt={user.username}
            className="w-32 h-32 bg-amber-400 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>

          {/* Show edit button only if this profile belongs to the logged-in user */}
          {authUser?._id === user._id && (
            <Button
              name="Edit Profile"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded mt-4"
            />
          )}
        </div>

        {/* -------- Right Panel: User's Posts -------- */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-4">Posts by {user.username}</h1>

          {blog.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {blog.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  {post.image && (
                    <Link to={`/userpage/${post._id}`}>
                      <img
                        className="w-full h-48 object-cover rounded-lg mb-3"
                        src={post.image}
                        alt={post.title}
                      />
                    </Link>
                  )}
                  <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {post.description.slice(0, 100)}...
                  </p>
                  <p className="text-sm text-gray-500">
                    🕒 {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
