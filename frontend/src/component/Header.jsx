import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { logout } from "../features/authSlice";
import api from "../api";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { user } = useSelector((state) => state.auth);

console.log("user",user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/user/logout"); // 🔥 cookie clear
      dispatch(logout());
      setIsOpen(false);
      navigate("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };
const isLoggedIn = Boolean(user);

  return (
  <header className="
  w-full sticky top-0 z-50
  bg-[rgba(15,23,42,0.6)]
  backdrop-blur-lg
  border-b border-white/10
  shadow-[0_8px_30px_rgba(0,0,0,0.3)]
">
  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

    {/* LOGO */}
    <Link
      to="/"
      className="text-2xl font-bold tracking-wide text-white"
    >
      Daily<span className="text-indigo-400">Blog</span>
    </Link>

    {/* DESKTOP NAV */}
    <nav className="hidden lg:flex items-center gap-8">

     
     {/* DESKTOP NAV */}
{user?.saveBlogs?.length > 0 && (
  <NavLink
    to={`/saveblog/${user._id}`}
    className={({ isActive }) =>
      `font-medium transition-all duration-500 ${
        isActive
          ? "text-white bg-blue-500 px-3 py-1 rounded-md"
          : "text-white hover:text-white"
      }`
    }
  >
    Saved Blogs
  </NavLink>
)}


      {user && (
        <NavLink
          to="/addblog"
          className={({ isActive }) =>
            `font-medium  transition-all duration-500 ${
              isActive
                ? "text-white bg-blue-500 px-3 py-1 rounded-md"
                : "text-white hover:text-white"
            }`
          }
        >
          Add Blog
        </NavLink>
      )}

      {/* AUTH AREA */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">

          <div className="text-right leading-tight">
            <p className="text-xs text-gray-100">Welcome</p>
            <p className="font-semibold text-white">
              {user.username}
            </p>
          </div>

          <Link to={`/user/${user._id}/blogs`}>
            <img
              src={user.image|| "https://via.placeholder.com/40"}
              alt="profile"
              className="
                w-10 h-10 rounded-full object-cover
                ring-2 ring-indigo-400
                hover:scale-105 transition
              "
            />
          </Link>

          <Button
            onClick={handleLogout}
            className="bg-red-500/80 text-white hover:bg-red-600"
            name="Logout"
          />
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            to="/login"
            className="bg-indigo-500/90 text-white hover:bg-indigo-600"
            name="Login"
          />
          <Button
            to="/createaccount"
            className="bg-emerald-500/90 text-white hover:bg-emerald-600"
            name="Signup"
          />
        </div>
      )}
    </nav>

    {/* MOBILE MENU BUTTON */}
    <button
      onClick={toggle}
      className="lg:hidden text-white"
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>

  {/* MOBILE NAV */}
  <div
    className={`lg:hidden transition-all duration-300 ${
      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <div className="
      px-6 py-4 flex flex-col gap-4
      bg-slate-900/90 backdrop-blur-md
      border-t border-white/10
    ">
     
       
       {/* DESKTOP NAV */}
{ user?.saveBlogs?.length > 0 && (
  <NavLink
    to={`/saveblog/${user._id}`}
    className={({ isActive }) =>
      `font-medium transition-all duration-500 ${
        isActive
          ? "text-white bg-blue-500 px-3 py-1 rounded-md"
          : "text-white hover:text-white"
      }`
    }
  >
    Saved Blogs
  </NavLink>
)}

       

      {user && (
        <NavLink
          onClick={toggle}
          to="/addblog"
       className={({ isActive }) =>
            `font-medium  transition-all duration-500 ${
              isActive
                ? "text-white bg-blue-500 px-3 py-1 rounded-md"
                : "text-white hover:text-white"
            }`
          }
        >
          Add Blog
        </NavLink>
      )}

      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-3">
           <Link to={`/user/${user._id}/blogs`}>
            <img
              src={user.image || "https://via.placeholder.com/40"}
              className="w-10 h-10 rounded-full ring-2 ring-indigo-400"
            />
           </Link>
            <div>
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-600 w-full"
            name="Logout"
          />
        </>
      ) : (
        <>
          <Button
            to="/login"
            onClick={toggle}
            className="bg-indigo-500 text-white hover:bg-indigo-600 w-full"
            name="Login"
          />
          <Button
            to="/createaccount"
            onClick={toggle}
            className="bg-emerald-500 text-white hover:bg-emerald-600 w-full"
            name="Signup"
          />
        </>
      )}
    </div>
  </div>
</header>

  );
}
