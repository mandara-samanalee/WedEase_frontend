"use client"

import React from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { useState, useRef } from "react";
import DefaultButton from "@/components/DefaultButton";

export default function EditProfile() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">My Profile</h1>

            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                        />
                    ) : (
                        <FaUserCircle className="w-24 h-24 text-purple-300" />
                    )}

                    <button
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-colors"
                    >
                        <FaCamera className="w-4 h-4" />
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        Upload New Picture
                    </button>
                    {profileImage && (
                        <button
                            onClick={() => setProfileImage(null)}
                            className="px-4 py-2 border border-red-500 bg-white text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-2">First Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block mb-2">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block mb-2">Phone Number</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2">Bio</label>
                    <textarea
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        rows={3}
                    ></textarea>
                </div>

                <div>
                    <label className="block mb-2">Address</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-2">City</label>
                        <input
                            type="text"
                            className="w-[320px] px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <DefaultButton btnLabel="Update profile" className="mt-2" />
                    <DefaultButton btnLabel="Delete Account" className="px-4 py-2 border border-red-500 bg-white text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm mt-2" />
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}
