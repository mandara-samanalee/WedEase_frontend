"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import DefaultButton from '@/components/DefaultButton';

export default function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Change Password</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text mb-2">Current password</label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className="absolute right-3 top-[20px] transform -translate-y-1/2 text-purple-500"
                            tabIndex={-1}
                        >
                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text mb-2">New password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                    <label className="block text mb-2">Confirm new password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[20px] transform -translate-y-1/2 text-purple-500"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                </div>

                <DefaultButton btnLabel="Update password" className="mt-4" />
            </div>
        </div>
    );
}
