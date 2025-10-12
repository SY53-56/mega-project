
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          {/* Brand / Info */}
          <div>
            <h2 className="text-xl font-semibold text-white">MyWebsite</h2>
            <p className="mt-2 text-sm text-gray-400">
              Building simple, beautiful web experiences with React.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:text-white transition ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `hover:text-white transition ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `hover:text-white transition ${
                      isActive ? 'text-blue-400' : ''
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                Twitter
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-100 transition"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MyWebsite — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
