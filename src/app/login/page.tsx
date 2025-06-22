import React from 'react';
import LoginForm from '../../section/LoginForm';
import loginSection from "@/assets/images/login-section.png";

export default function Login() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center p-6">
        <LoginForm />
      </div>
      <div className="w-1/2" >
        <img
          src={loginSection.src}
          alt="Wedding image"
          className="max-w-full h-full"
        />
      </div>
    </div>
  );
} 
