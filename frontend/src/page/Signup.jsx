import React, { useState } from "react";
import Button from "../component/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchSignup } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(fetchSignup(form)).unwrap();
      console.log("Signup successful:", data);
      navigate("/"); // redirect after signup
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-gray-100">
      <div className="w-[400px] px-5 py-6 shadow-2xl bg-white rounded">
        <h1 className="text-center text-4xl font-bold mb-5">Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleFormData}
            required
            placeholder="Enter your username"
            className="mb-3 px-3 py-1 rounded border"
          />
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleFormData}
            required
            type="email"
            placeholder="Enter your email"
            className="mb-3 px-3 py-1 rounded border"
          />
          <label>Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleFormData}
            required
            type="password"
            placeholder="Enter your password"
            className="mb-3 px-3 py-1 rounded border"
          />
          <Button type="submit" name="Signup" className="bg-blue-600 text-white mt-4" />
        </form>
        {status === "loading" && <p className="text-yellow-500 mt-2">Signing up...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
