import React from 'react';
import loginSection from "@/assets/images/login-section.png";
import SignupForm from '@/section/SignupForm';

export default function Register() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center p-6">
        <SignupForm />
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
