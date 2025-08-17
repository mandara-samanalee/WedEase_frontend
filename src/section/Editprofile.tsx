"use client"

import React, { useRef, useState, useEffect } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import DefaultButton from "@/components/DefaultButton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/utils/confirmationModel";

export default function EditProfile() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const router = useRouter();
    const didFetch = useRef(false); // add guard
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Prefill form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [distric, setDistric] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("");

    // GET vendor profile and prefill form
    useEffect(() => {
        if (didFetch.current) return; // prevent double run in React StrictMode (dev)
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

                const endpoint = `${BASE_URL}/vendor/getdetails/${userId}`;
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
                toast.success("Profile data retrieved successfully")

                const v = json?.data ?? json;
                setFirstName(v?.firstName || "");
                setLastName(v?.lastName || "");
                setEmail(v?.email || "");
                setContactNo(v?.contactNo || "");
                setAddress(v?.address || "");
                setCity(v?.city || "");
                setDistric(v?.distric || "");
                setProvince(v?.province || "");
                setCountry(v?.country || "");
                setProfileImage(v?.image || null);
            } catch (e) {
                toast.error("Unable to load profile");
                console.error(e);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, []);

    const handleDeleteAccount = async (): Promise<boolean> => {
        if (!BASE_URL) {
            console.error("Backend URL not configured");
            return false;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            console.error("Not authenticated");
            return false;
        }

        let userId: string | undefined;
        let token: string | undefined;
        try {
            const parsed = JSON.parse(raw);
            userId = parsed.userId;
            token = parsed.token;
        } catch {
            toast.error("Invalid session");
            return false;
        }
        if (!userId || !token) {
            console.error("User ID or token is missing");
            return false;
        }

        try {
            setDeleting(true);
            const endpoint = `${BASE_URL}/user/delete-account/${userId}`;
            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                toast.error(data?.message || "Failed to delete account");
                return false;
            }

            toast.success("Account deleted successfully");
            localStorage.removeItem("user");
            setTimeout(() => router.replace("/login"), 2500);
            return true;
        } catch (err) {
            toast.error("An error occurred while deleting account");
            console.error("Delete account error:", err);
            return false;
        } finally {
            setDeleting(false);
        }
    };

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
            console.error("Invalid user data in localStorage", error);
            toast.error("Invalid session");
            return;
        }

        if (!userId || !token) 
            return console.error("User ID or token is missing");
        if (!BASE_URL) 
            return console.error("Backend URL not configured");

        // Build multipart form-data (do NOT set Content-Type manually)
        const form = new FormData();
        form.append("firstName", firstName.trim());
        form.append("lastName", lastName.trim());
        form.append("address", address.trim());
        form.append("city", city.trim());
        form.append("distric", (distric || "").trim());
        form.append("province", (province || "").trim());
        form.append("country", country.trim());
        form.append("contactNo", contactNo.trim());
        if (imageFile) form.append("image", imageFile);

        try {
            const res = await fetch(`${BASE_URL}/vendor/profile/${userId}`,
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
        } catch (error) {
            toast.error("An error occurred while updating profile");
            console.error("Update profile error:", error);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

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
                <p className="text-sm text-gray-500">Loading profile...</p>
            ) : (
                <div className="space-y-6">
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
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2">Contact Number</label>
                            <input
                                name="contactNo"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                title="Use format: +countryCode|number (e.g. +94|712345678)"
                                pattern="^\\+\\d{1,4}\\|\\d{7,15}$"
                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2">Address</label>
                        <input
                            name="address"
                            type="text"
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-2">City/ Region</label>
                            <input
                                name="city"
                                type="text"
                                className="w-[320px] px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2">Distric/ Suburb</label>
                            <input
                                name="distric"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={distric}
                                onChange={(e) => setDistric(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-2">Province/ State</label>
                            <input
                                name="province"
                                type="text"
                                className="w-[320px] px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2">Country</label>
                            <input
                                name="country"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pb-24">
                        <DefaultButton
                            btnLabel="Update profile"
                            className="mt-2"
                            handleClick={handleUpdateProfile}
                        />
                        <button
                            type="button"
                            className="w-[200px] py-2 border border-red-500 bg-white text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm mt-2 disabled:opacity-60"
                            onClick={() => setConfirmOpen(true)}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>

                    <ConfirmModal
                        open={confirmOpen}
                        onClose={() => (!deleting ? setConfirmOpen(false) : null)}
                        title="Delete account?"
                        message="This action cannot be undone. Are you sure you want to delete your account?"
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="danger"
                        disableOutsideClose
                        onConfirm={async () => {
                            const ok = await handleDeleteAccount();
                            if (ok) setConfirmOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}