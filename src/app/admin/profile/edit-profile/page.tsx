"use client"

import React, { useRef, useState, useEffect } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import DefaultButton from "@/components/DefaultButton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/utils/confirmationModel";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";

export default function AdminEditProfile() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
   // const [imageFile, setImageFile] = useState<File | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    // Admin profile form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("admin@wedease.com");
    const [contactNo, setContactNo] = useState("");
    const [adminId, setAdminId] = useState("");
    const [role, setRole] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("");

    // Load mock data on component mount
    useEffect(() => {
        // Mock admin data - in real app this would come from API
        setFirstName("Hansika");
        setLastName("Gimhani");
        setEmail("admin@wedease.com");
        setContactNo("+947723478567");
        setAdminId("ADMIN-001");
        setRole("System Admin");
        setAddress("");
        setCity("");
        setDistrict("");
        setProvince("");
        setCountry("");
        setProfileImage(""); 
    }, []);

    const handleDeleteAccount = async (): Promise<boolean> => {
        try {
            setDeleting(true);
            // Mock delete - in real app this would be an API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success("Account deleted successfully");
            localStorage.removeItem("admin");
            localStorage.removeItem("adminToken");
            setTimeout(() => router.replace("/admin/login"), 2500);
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
      //  setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setProfileImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        // Mock update - in real app this would be an API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Profile updated successfully");
            
            // Update local storage with new data
            const adminData = {
                firstName,
                lastName,
                email,
                contactNo,
                adminId,
                role,
                address,
                city,
                district,
                province,
                country
            };
            localStorage.setItem("admin", JSON.stringify(adminData));
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
                                value={contactNo}
                                onChange={(e) => setContactNo(e.target.value)}
                                placeholder="+1|5551234567"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-2">Admin ID</label>
                            <input
                                name="adminId"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg bg-gray-50 text-gray-600"
                                disabled
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2">Role/Designation</label>
                            <input
                                name="role"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={role}
                                disabled
                                onChange={(e) => setRole(e.target.value)}
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
                            <label className="block mb-2">City/Region</label>
                            <input
                                name="city"
                                type="text"
                                className="w-[320px] px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block mb-2">District/Suburb</label>
                            <input
                                name="district"
                                type="text"
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-2">Province/State</label>
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
                            btnLabel="Update Profile"
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
                        title="Delete Admin Account?"
                        message="This action cannot be undone. Are you sure you want to delete your admin account?"
                        confirmText="Delete Account"
                        cancelText="Cancel"
                        variant="danger"
                        disableOutsideClose
                        onConfirm={async () => {
                            const ok = await handleDeleteAccount();
                            if (ok) setConfirmOpen(false);
                        }}
                    />
                </div>
            </div>
        </AdminMainLayout>
    );
}