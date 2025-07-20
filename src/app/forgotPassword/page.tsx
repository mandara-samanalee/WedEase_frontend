"use client";

import React, { useState } from "react";
import GradientButton from "@/components/GradientButton";
import { MdEmail } from "react-icons/md";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your logic to send OTP to the entered email address here
        setMessage("An OTP has been sent to your email address. Please check your inbox.");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-300 max-w-[450px] w-full">
                <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter your registered email address. We will send an OTP to your email for password reset.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-2xl" />
                    </div>

                    <GradientButton btnLabel="Next" className="w-full mt-4" />
                </form>
                {message && (
                    <div className="mt-4 text-green-600 text-center">{message}</div>
                )
                }
            </div >
        </div >
    );
}



