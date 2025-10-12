import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-gray-400 shadow p-3 flex flex-col lg:flex-row lg:justify-between lg:items-center">
      {/* Logo + Hamburger */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">BLOG</h1>

        {/* Hamburger Button */}
        <Button
          classname="flex lg:hidden"
          name={isOpen ? <X size={24} /> : <Menu size={24} />}
          onClick={toggle}
        />
      </div>

      {/* Navigation Links */}
      <nav
        className={`flex-col lg:flex lg:flex-row gap-6 transition-all duration-300 ${
          isOpen ? 'flex mt-3' : 'hidden lg:flex mt-0'
        }`}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition font-medium ${
              isActive
                ? 'text-blue-700 bg-blue-50 underline'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/addblog"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md transition font-medium ${
              isActive
                ? 'text-blue-700 bg-blue-50 underline'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`
          }
        >
          Add Blog
        </NavLink>
        {/* Mobile Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mt-3 lg:mt-0">
          <Button to="/login" className="bg-red-600 text-white hover:bg-red-700" name="login" />
          <Button to="/signup" className="bg-green-600 text-white hover:bg-green-700" name="signup" />
        </div>
      </nav>
    </header>
  );
}
