"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from "@/components/GradientButton";

export default function VendorSignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-l p-8 border-2 border-purple-300 w-[600]">
                <form className="space-y-2">
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
                        <label className="block text-purple-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">City/Region</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Mobile Number</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="w-20 px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="+94"
                                maxLength={5}
                                required
                            />
                            <input
                                type="tel"
                                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        </div>
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
                                style={{ height: 40 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <GradientButton btnLabel="Signup as a Vendor" className="w-full" />
                    </div>
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
        </div>
    );
};

