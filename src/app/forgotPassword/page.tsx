"use client";

import React, { useState } from "react";
import GradientButton from "@/components/GradientButton";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/utils/validations";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | undefined>();
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate email before calling APIs
        const eErr = validateEmail(email);
        setEmailError(eErr);
        if (eErr) {
            console.error(eErr);
            return;
        }

        try {
            // check user exists
            const response = await fetch(`${BASE_URL}/user/get-byemail/${email}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch user data");
            }

            // Send OTP with recipient header
            const otpRes = await fetch(`${BASE_URL}/otp/send`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "recipient": email,
                },
            });
            const otpData = await otpRes.json();

            if (!otpRes.ok) {
                throw new Error(otpData.message || "Failed to send OTP");
            }

            localStorage.setItem("otpId", otpData.otpId);
            localStorage.setItem("resetUser", JSON.stringify(data));

            setMessage("OTP has been sent to your email. Please check your inbox.");
            setEmail("");

            await new Promise((r) => setTimeout(r, 3000));
            router.push('/verifyAccount');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Something went wrong");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-300 max-w-[450px] w-full">
                <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Enter your registered email address. We will send an OTP to your email for password reset.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            required
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value); if (emailError) setEmailError(undefined);
                            }}
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none
                        ${emailError ? "border-red-500 focus:ring-2 focus:ring-red-400" : "border-purple-300 focus:ring-2 focus:ring-purple-400"}`}
                            aria-invalid={!!emailError}
                        />
                        <MdEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 text-2xl" />
                    </div>
                    {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}

                    <GradientButton btnLabel="Next" className="w-full mt-4" />
                </form>
                {message && (
                    <div className="mt-4 text-green-600 text-center">{message}</div>
                )
                }
            </div >
        </div >
    );
}



