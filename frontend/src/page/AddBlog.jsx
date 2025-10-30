// src/page/AddBlog.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import { fetchAddData } from "../features/blogSlice";

export default function AddBlog() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [files, setFiles] = useState([]); // store selected image files
  const [previews, setPreviews] = useState([]); // for preview URLs

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token =
    useSelector((state) => state.auth.token) ||
    localStorage.getItem("token");

  const { error, status } = useSelector((state) => state.blog);

  // handle text input
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle file input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // create local preview URLs
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  // submit form
  const handleForm = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);

    // append all selected files
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await dispatch(fetchAddData(formData)).unwrap();
      alert("✅ Blog added successfully!");
      setForm({ title: "", description: "" });
      setFiles([]);
      setPreviews([]);
      navigate("/");
    } catch (err) {
      console.error("❌ Error adding blog:", err);
      alert(err || "Failed to add blog");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          Add New Blog
        </h1>

        <form onSubmit={handleForm} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormData}
              required
              placeholder="Enter blog title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormData}
              required
              placeholder="Write your blog description..."
              className="px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Image Preview */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {previews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            name={status === "loading" ? "Adding..." : "Add Blog"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors duration-300"
            disabled={status === "loading"}
          />
        </form>

        {error && (
          <p className="text-red-500 mt-3 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}
