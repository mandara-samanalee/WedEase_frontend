"use client"

import React, { useState, useEffect } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from '@/components/GradientButton';
import { FiLock } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { validatePasswords } from '@/utils/validations';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type FormErrors = {
    password?: string;
    confirm?: string;
};

export default function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const router = useRouter();

    // fetch the email from localstorage on page load
    useEffect(() => {
        const storedUser = localStorage.getItem("resetUser");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setEmail(user.data.email);
            } catch {
                console.error("Failed to parse user data from localStorage");
            }
        } else {
            // If no user found in storage, redirect to forgot password page
            router.push("/forgotPassword");
        }
    }, [router]);

    const handlePasswordChange = (value: string) => setNewPassword(value);
    const handleConfirmPasswordChange = (value: string) => setConfirmPassword(value);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate here
        const errors = validatePasswords(newPassword, confirmPassword) as FormErrors;
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        const loadingId = toast.loading("Resetting password...");
        try {
            const res = await fetch(`${BASE_URL}/user/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword, confirmPassword }),
            });

            const data = await res.json();
            toast.dismiss(loadingId);

            if (res.ok && data.status) {
                // Clear storage so OTP flow resets
                localStorage.removeItem("resetUser");
                localStorage.removeItem("otpId");

                toast.success("Password reset successfully!");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                const msg = data?.message || "Failed to reset password";
                setErrorMessage(msg);
                toast.error(msg);
            }
        } catch (err) {
            console.error(err);
            toast.dismiss(loadingId);
            const msg = "Something went wrong. Please try again.";
            setErrorMessage(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-300 max-w-[450px] w-full">
                <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiLock className="text-purple-800 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                        Reset Password
                    </h2>
                </div>

                {errorMessage && (
                    <div className="mb-4 text-red-500 text-sm text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                                tabIndex={-1}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
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
                        {formErrors.confirm && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirm}</p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-purple-800 mb-2">Password Requirements:</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                            <li className="flex items-center gap-2">
                                <span className={newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}>•</span>
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>•</span>
                                Include one uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>•</span>
                                Include one number
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[@$!%*?&#]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>•</span>
                                Include one special character
                            </li>
                        </ul>
                    </div>

                    <GradientButton
                        btnLabel="Reset Password"
                        className="w-full mt-4"
                    />
                </form>

                <div className="mt-4 text-center">
                    <a href="/login" className="text-purple-600 hover:text-purple-800 text-md font-medium transition-colors">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}