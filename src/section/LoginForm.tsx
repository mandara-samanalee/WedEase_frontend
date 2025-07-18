"use client";

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from '../components/GradientButton';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-[400] bg-white p-8 rounded-lg shadow-lg border-2 border-purple-300">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">Welcome</h1>

        <form className="space-y-5">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 mb-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Password"
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

            <div className="text-right mt-1">
              <a href="/forgotPassword" className="text-sm text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <GradientButton btnLabel="Login" className="w-full mt-4" />

          <div className="mt-4 text-center">
            <p>Don&apos;t you have an account? <a href="/register" className="text-purple-600 hover:font-bold">Signup</a></p>
          </div>

        </form>
      </div>

    </div>
  );
}




