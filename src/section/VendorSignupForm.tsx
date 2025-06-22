"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import DefaultButton from "@/components/DefaultButton";

function VendorSignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-purple-200 via-purple-100 to-white px-4">
            <div className="bg-white rounded-lg shadow-l p-8 border-2 border-purple-300 w-full max-w-xl">
                <h1 className="text-3xl font-bold text-purple-700 text-center mb-2">
                    Become a WedEase Vendor
                </h1>
                <p className="text-center text-lg text-purple-500 mb-8">
                    Join our trusted network and grow your business with dream weddings!
                </p>

                <form className="space-y-5">
                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Address Line 1</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Address Line 2</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Mobile Number</label>
                        <div className="flex space-x-2">
                            <select className="px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                                {/* Add more country codes as needed */}
                            </select>
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
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Confirm password"
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

                    <DefaultButton btnLabel="Signup as a Vendor" className="w-full mt-4" />

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

export default VendorSignupForm;  