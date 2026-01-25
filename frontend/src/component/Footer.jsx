import React from "react";
import { Instagram, Twitter, Facebook, Linkedin, InstagramIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-3">About</h3>
            <p className="text-sm text-gray-400">
              This is a blog website built with React, Node.js and MongoDB.
              Share your thoughts, read amazing articles and connect with the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">All Blogs</li>
              <li className="hover:text-white cursor-pointer">Saved Blogs</li>
              <li className="hover:text-white cursor-pointer">Profile</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-3">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get latest updates and articles directly in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg px-4 py-2 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Your Blog. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              <InstagramIcon size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
