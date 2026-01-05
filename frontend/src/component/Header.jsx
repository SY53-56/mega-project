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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("usersahul",user)
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
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          DailyBlog
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/addblog"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                }`
              }
            >
              Add Blog
            </NavLink>
          )}

          {/* AUTH AREA */}
          {isLoggedIn? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome</p>
                <p className="font-semibold text-gray-800">
                  {user.username}
                </p>
              </div>

             <Link to={`/user/${user._id}/blogs`}>
              <img
                src={user.img || "https://via.placeholder.com/40"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
             </Link>

              <Button
                onClick={handleLogout}
                className="bg-red-500 text-white hover:bg-red-600"
                name="Logout"
              />
            </div>
          ):(   
            <div className="flex gap-3">
              <Button
                to="/login"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                name="Login"
              />
              <Button
                to="/createaccount"
                className="bg-green-600 text-white hover:bg-green-700"
                name="Signup"
              />
            </div>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={toggle}
          className="lg:hidden text-gray-700"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4 bg-gray-50 border-t">

          <NavLink to="/" onClick={toggle} className="font-medium text-gray-700">
            Home
          </NavLink>

          {user && (
            <NavLink
              to="/addblog"
              onClick={toggle}
              className="font-medium text-gray-700"
            >
              Add Blog
            </NavLink>
          )}

          {isLoggedIn? (
            <>
              <div className="flex items-center gap-3 mt-2">
               <Link to={`/user/${user._id}/blogs`}>
                <img
                  src={user.img || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full"
                />
               </Link>
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
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
                className="bg-indigo-600 text-white hover:bg-indigo-700 w-full"
                name="Login"
              />
              <Button
                to="/createaccount"
                onClick={toggle}
                className="bg-green-600 text-white hover:bg-green-700 w-full"
                name="Signup"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
