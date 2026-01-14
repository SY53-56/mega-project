import React, { useState } from "react";
import Button from "../component/Button";
import { useDispatch, useSelector } from "react-redux";
import {fetchLogin, fetchMe}  from "../features/authThunk";
import { useNavigate,Link, } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formHandler = async (e) => {
    e.preventDefault();
    try {
 await dispatch(fetchLogin(form)).unwrap()
 //then(()=>fetchMe())
     
navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-[400px] px-4 py-6 shadow-2xl">
        <h1 className="text-center text-5xl font-bold">Login Form</h1>
        <form onSubmit={formHandler} className="flex flex-col p-4">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleForm}
            placeholder="Enter your email"
            className="mb-3 px-2 py-0.5 rounded border"
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleForm}
            placeholder="Enter your password"
            className="mb-3 px-2 py-0.5 rounded border"
          />
          <Button type="submit" className="bg-amber-500 active:scale-95 text-white mt-5" name="Login" />
          <p className="mt-2">if you want to <Link className="text-blue-600" to="/createaccount">create new account</Link></p>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
