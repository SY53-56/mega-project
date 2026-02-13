import React, { useState } from "react";
import Button from "../component/Button";
import { useDispatch, useSelector } from "react-redux";
import  {fetchSignup}  from "../features/authThunk";
import { useNavigate, Link } from "react-router-dom";

export default function CreateAccount() {
  // Match backend field names: use "img" instead of "image"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);
  const [file,setFile]  =useState({})
  // Handle input changes
  const handleFormData = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleFile=(e)=>{
   const selectFile= e.target.files[0]
   setFile(selectFile)
  }

  // Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault();
     let formData =new FormData()
      formData.append("username",form.username)
      formData.append("email",form.email)
      formData.append("password",form.password)
    if(file)  formData.append("image",file)
    try {
     
  await dispatch(fetchSignup(formData));
      
      navigate("/",{state:{message:"signup successfully"}}); // Redirect after signup
    } catch (err) {
      console.error("Create account failed:", err);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-gray-100">
      <div className="w-[400px] px-5 py-6 shadow-2xl bg-white rounded">
        <h1 className="text-center text-4xl font-bold mb-5">Create New Account</h1>
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

          <label>Profile Image URL</label>
          <input
            name="image"  // Changed from "image" to "img" to match backend
            type="file"
              accept="image/*"
            onChange={handleFile}
         
            placeholder="https://example.com/image.jpg"
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

          <Button type="submit" name={status === "loading" ? "Signing up..." : "Signup"} className="bg-blue-600 active:scale-95 text-white mt-4" />

          <p className="mt-2">
            Already have an account?{" "}
            <Link className="text-blue-500" to="/login">
              Login
            </Link>
          </p>
        </form>

        {status === "loading" && <p className="text-yellow-500 mt-2">Signing up...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
