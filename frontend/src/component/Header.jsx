import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false); // close mobile menu on logout
  };

  return (
    <header className="w-full bg-gray-400 mx-0 px-0 lg:px-32 shadow p-3 flex flex-col lg:flex-row lg:justify-between lg:items-center">
      {/* Logo + Hamburger */}
    <div className="flex justify-between items-center">
  <Link className="text-2xl font-bold" to="/">Dailys blog</Link>
  
  <Button
    className="block lg:hidden"   // ✅ visible on small screens, hidden on lg+
    name={isOpen ? <X size={24} /> : <Menu size={24} />}
    onClick={toggle}
  />
</div>

      {/* Navigation */}
      <nav
        className={`flex-col lg:flex lg:flex-row gap-6 transition-all duration-300 ${
          isOpen ? "flex mt-3" : "hidden lg:flex mt-0"
        }`}
      >
       
       {token? <NavLink
          to="/addblog"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition font-medium ${
              isActive
                ? "text-blue-700 bg-blue-50 underline"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
            }`
          }
        >
          Add Blog
        </NavLink>:""}

        {/* Auth Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-3 lg:mt-0 items-center">
          {token ? (
            <>
              <span className="text-white font-medium">Hello, {user?.username}</span>
              <Button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700"
                name="Logout"
              />
            </>
          ) : (
            <>
              <Button
                to="/login"
                className="bg-red-600 text-white hover:bg-red-700"
                name="Login"
              />
              <Button
                to="/Createaccount"
                className="bg-green-600 text-white hover:bg-green-700"
                name="Create Account"
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
