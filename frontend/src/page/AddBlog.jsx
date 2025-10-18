// src/page/AddBlog.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import { fetchAddData } from "../features/blogSlice";

export default function AddBlog() {
  const [form, setForm] = useState({ title: "", image: "", description: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const { error, status } = useSelector((state) => state.blog);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first!");

    try {
      const result = await dispatch(fetchAddData(form)).unwrap();
      console.log("Blog added successfully:", result);
      setForm({ title: "", image: "", description: "" });
      navigate("/");
    } catch (err) {
      console.error("Error adding blog:", err);
      alert(err || "Failed to add blog");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">Add New Blog</h1>
        <form onSubmit={handleForm} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleFormData}
              required
              placeholder="Enter blog title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleFormData}
              required
              placeholder="https://example.com/image.jpg"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormData}
              required
              placeholder="Write your blog description..."
              className="px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <Button
            type="submit"
            name={status === "loading" ? "Adding..." : "Add Blog"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors duration-300"
            disabled={status === "loading"}
          />
        </form>

        {error && <p className="text-red-500 mt-3 text-center font-medium">{error}</p>}
      </div>
    </div>
  );
}
