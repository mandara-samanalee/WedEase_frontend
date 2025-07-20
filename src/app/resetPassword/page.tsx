"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import GradientButton from '@/components/GradientButton';
import { FiLock } from "react-icons/fi";

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (value: string) => {
        setNewPassword(value);
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
    };

    const validatePasswords = () => {
        const newErrors: { password?: string; confirm?: string } = {};

        if (newPassword.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirm = 'Passwords do not match';
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validatePasswords()) {
            // Handle password reset logic
            console.log('Password reset successfully');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-300 max-w-[450px] w-full">
                <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiLock className="text-purple-800 text-2xl"/>
                    </div>
                    <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                        Reset Password
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2">
                            New Password
                        </label>
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
                    </div>

                    <div>
                        <label className="block mb-2">
                            Confirm New Password
                        </label>
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
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-purple-800 mb-2">Password Requirements:</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                            <li className="flex items-center gap-2">
                                <span className={newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'}>•</span>
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>•</span>
                                Include one uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>•</span>
                                Include One number
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
