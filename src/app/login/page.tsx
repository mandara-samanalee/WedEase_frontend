import React from "react";
import LoginForm from "../../section/LoginForm";
import loginSection from "@/assets/images/login-section.png";
import { Toaster } from "react-hot-toast";

export default function Login() {
  return (
    <div className="flex h-screen">
      {/* Left side (login form + toaster) */}
      <div className="w-1/2 flex items-center justify-center p-6 relative">
        {/* Toaster positioned relative to this container */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <Toaster position="top-center" 
          toastOptions={{
            style: {
              minWidth: "200px",
            }
          }} />
        </div>

        <LoginForm />
      </div>

      {/* Right side (image) */}
      <div className="w-1/2">
        <img
          src={loginSection.src}
          alt="Wedding image"
          className="max-w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
