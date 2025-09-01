"use client"

import React, { useState } from 'react';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import DefaultButton from '@/components/DefaultButton';
import { validatePasswords } from '@/utils/validations';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwErrors, setPwErrors] = useState<{ password?: string; confirm?: string }>({});


    const handlePasswordUpdate = async () => {
        // Inline validation only
        const errors = validatePasswords(newPassword, confirmPassword);
        setPwErrors(errors);
        if (Object.keys(errors).length > 0) return;

        // read user from localStorage (user: { userId, email, role, token })
        const raw = localStorage.getItem('user'); 
        if (!raw) {
            console.error('Not authenticated');
            return;
        }
        let userId: string;
        let token: string;

        try {
            const parsed = JSON.parse(raw);
            userId = parsed.userId;
            token = parsed.token;
        } catch {
            console.error('Invalid object in localStorage');
            return;
        }
        if (!userId || !token) {
            console.error('Missing userId or token');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/user/change-password/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.message || 'Failed to update password');
                return;
            }

            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPwErrors({});
        } catch (error) {
            console.error(error instanceof Error ? error.message : "An error occurred");
        }
    };

    return (
        <div className="max-w-md">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-8">Change Password</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text mb-2">Current password</label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-purple-500"
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
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (pwErrors.password) setPwErrors((s) => ({ ...s, password: undefined }));
                            }}
                            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                            ${pwErrors.password ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-purple-500"
                            tabIndex={-1}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                    {pwErrors.password && <p className="mt-1 text-sm text-red-600">{pwErrors.password}</p>}
                </div>

                <div>
                    <label className="block text mb-2">Confirm new password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (pwErrors.confirm) setPwErrors((s) => ({ ...s, confirm: undefined }));
                            }}
                            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                            ${pwErrors.confirm ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-purple-500"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                    </div>
                    {pwErrors.confirm && <p className="mt-1 text-sm text-red-600">{pwErrors.confirm}</p>}
                </div>

                <DefaultButton
                    btnLabel="Update Password"
                    className="mt-4"
                    handleClick={handlePasswordUpdate}
                />
            </div>
        </div>
    );
}