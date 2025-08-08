"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from "@/components/GradientButton";
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VendorSignupForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        contactNo: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [prefix, setPrefix] = useState('+94');
    const [number, setNumber] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const ContactNo = `${prefix}${number}`;

        try {
            const response = await fetch(`${BASE_URL}/vendor/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    contactNo: ContactNo
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to register vendor");
            }

            toast.success("Registration successful!");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                city: "",
                contactNo: "",
                password: "",
                confirmPassword: "",
            });
            setNumber("");
            setPrefix("+94");
        } catch (error) {
            if (error instanceof Error) {
                toast.error("An error occurred during registration");
            }
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-l p-8 border-2 border-purple-300 w-[600]">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-purple-700 font-semibold mb-1">First Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-purple-700 font-semibold mb-1">Last Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">City/Region</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-purple-700 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            />
                            <input
                                type="tel"
                                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
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
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

