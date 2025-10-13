"use client"

import React, { useRef, useState, useEffect } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import DefaultButton from "@/components/DefaultButton";
import toast from "react-hot-toast";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { Loader } from "lucide-react";

export default function AdminEditProfile() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const didFetch = useRef(false);

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Admin profile form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [adminId, setAdminId] = useState("");
    const [role, setRole] = useState("");

    // GET admin profile and prefill form
    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        const fetchProfile = async () => {
            try {
                if (!BASE_URL) {
                    console.error("Backend URL not configured");
                    return;
                }
                const raw = localStorage.getItem("user");
                if (!raw) {
                    console.error("Not authenticated");
                    return;
                }

                let userId: string | undefined;
                let token: string | undefined;
                try {
                    const parsed = JSON.parse(raw);
                    userId = parsed?.userId;
                    token = parsed?.token;
                } catch {
                    toast.error("Invalid session");
                    return;
                }
                if (!userId || !token) {
                    console.error("Missing session");
                    return;
                }

                const endpoint = `${BASE_URL}/admin/getdetails/${userId}`;
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    toast.error(json?.message || 'Failed to load profile');
                    return;
                }
                toast.success("Profile data retrieved successfully");

                const data = json?.data ?? json;
                setFirstName(data?.firstName || "");
                setLastName(data?.lastName || "");
                setEmail(data?.email || "");
                setContactNo(data?.contactNo || "");
                setAdminId(data?.userId || "");
                setRole(data?.designation || "");
                setProfileImage(data?.image || null);
            } catch (e) {
                toast.error("Unable to load profile");
                console.error(e);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setProfileImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        const raw = localStorage.getItem("user");
        if (!raw) return console.error("Not authenticated");

        let userId: string | undefined;
        let token: string | undefined;
        try {
            const parsed = JSON.parse(raw);
            userId = parsed.userId;
            token = parsed.token;
        } catch (error) {
            console.error("Invalid admin data in localStorage", error);
            toast.error("Invalid session");
            return;
        }

        if (!userId || !token)
            return console.error("User ID or token is missing");
        if (!BASE_URL)
            return console.error("Backend URL not configured");

        // Build multipart form-data
        const form = new FormData();
        form.append("firstName", firstName.trim());
        form.append("lastName", lastName.trim());
        form.append("contactNo", contactNo.trim());
        if (imageFile) form.append("image", imageFile);

        try {
            const res = await fetch(`${BASE_URL}/admin/update-profile/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: form,
                }
            );

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                toast.error(data?.message || "Failed to update profile");
                return;
            }
            toast.success("Profile updated successfully");
            
            // Update localStorage with new data
            const adminData = {
                ...JSON.parse(raw),
                firstName,
                lastName,
                contactNo,
            };
            localStorage.setItem("user", JSON.stringify(adminData));
        } catch (error) {
            toast.error("An error occurred while updating profile");
            console.error("Update profile error:", error);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <AdminMainLayout>
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-8">
                    Admin Profile
                </h1>

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
                            type="button"
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
                </div>

                {loadingProfile ? (
                    <div className="flex flex-col items-center justify-center py-12">
                    <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading profile...</p>
                </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-2">Admin ID</label>
                                <input
                                    name="adminId"
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-gray-50 text-gray-600"
                                    disabled
                                    value={adminId}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-2">Role/Designation</label>
                                <input
                                    name="role"
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-gray-50 text-gray-600"
                                    value={role}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-2">First Name</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-2">Last Name</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-gray-50 text-gray-600"
                                    required
                                    disabled
                                    value={email}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block mb-2">Contact Number</label>
                                <input
                                    name="contactNo"
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                    placeholder="+1|5551234567"
                                    title="Use format: +countryCode|number"
                                    pattern="^\\+\\d{1,4}\\|\\d{7,15}$"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pb-24">
                            <DefaultButton
                                btnLabel="Update Profile"
                                className="mt-2"
                                handleClick={handleUpdateProfile}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AdminMainLayout>
    );
}