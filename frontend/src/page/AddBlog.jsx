// src/page/AddBlog.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import { fetchAddData } from '../features/blogSlice'

export default function AddBlog() {
  const [form, setForm] = useState({ title: "", image: "", description: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get token from Redux state or localStorage
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const { error, status } = useSelector((state) => state.blog);

  // Update form state on input change
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleForm = async (e) => {
    e.preventDefault();
    console.log("Form submitted", form, token); // Debug log

    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const result = await dispatch(fetchAddData(form)).unwrap();
      console.log("Blog added successfully:", result);
      setForm({ title: "", image: "", description: "" });
      navigate("/"); // Redirect after successful add
    } catch (err) {
      console.error("Error adding blog:", err);
      alert(err || "Failed to add blog");
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-blue-950 text-white">
      <div className="w-[400px] border px-5 py-3 rounded shadow-2xl">
        <h1 className="text-5xl font-bold text-center mb-3">Add Blog</h1>
        <form onSubmit={handleForm} className="flex flex-col">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleFormData}
            required
            className="mb-3 px-3 py-0.5 rounded border"
          />

          <label>Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleFormData}
            required
            className="mb-3 px-3 py-0.5 rounded border"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormData}
            required
            className="mb-3 px-3 py-1 rounded border"
          />

          <Button type="submit" className="bg-orange-600 text-white mt-4" name="Add Blog" />
        </form>

        {status === "loading" && <p className="text-yellow-300 mt-2">Adding blog...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
