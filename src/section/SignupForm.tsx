"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from "@/components/GradientButton";
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[450px] mt-2 bg-white p-8 rounded-lg shadow-lg border-2 border-purple-300">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Create New Account</h1>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[20px] transform -translate-y-1/2 text-purple-500"
                tabIndex={-1}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[20px] transform -translate-y-1/2 text-purple-500"
                tabIndex={-1}
              >
                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
              </button>
            </div>
          </div>

          <GradientButton btnLabel="Signup" className="w-full mt-4" />
        </form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:font-bold">
              Sign In
            </a>
          </p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <span className="text-purple-700 font-bold text-[20px] flex items-center">Want to register as a vendor?</span>
        <a
          href="/vendor/register"
          className="ml-2 text-purple-700 font-semibold  hover:text-purple-900 transition text-[18px] align-baseline"
        >
          Register here
        </a>
      </div>
    </div>
  );
}