"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from "@/components/GradientButton";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[450] mt-2 bg-white p-8 rounded-lg shadow-lg border-2 border-purple-300">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Create New Account</h1>

        <form className="space-y-5">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-purple-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
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
          className="ml-2 text-purple-700 font-semibold underline hover:text-purple-900 transition text-[18px] align-baseline"
        >
          Register here
        </a>
      </div>
    </div>
  );
}


