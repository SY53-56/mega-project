import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../appwrite/auth';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from "./index";

export default function Login() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    setError(null);
    try {
      const session = await authService.login(data);
      if (!session) {
        setError("Login failed. Check your credentials.");
        return;
      }
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        dispatch(authLogin(currentUser));
        navigate("/");
      } else {
        setError("Could not fetch logged-in user. Check cookies.");
      }
    } catch (e) {
      console.error("Login error:", e);
      setError(e.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border-black/10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-8" onSubmit={handleSubmit(login)}>
          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(value) ||
                    "Email address must be valid",
                },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: true })}
            />
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
