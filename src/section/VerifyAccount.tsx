
"use client";

import React, { useRef, useState, useEffect } from "react";
import GradientButton from "@/components/GradientButton";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function VerifyAccount() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [message, setMessage] = useState("");
    const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [otpId, setOtpId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const resetUser = localStorage.getItem("resetUser");
        const storedOtpId = localStorage.getItem("otpId");
        if (resetUser) {
            const user = JSON.parse(resetUser);
            setEmail(user.data.email);
        }
        if (storedOtpId) {
            setOtpId(storedOtpId)
        }
        }, []);

    // Updates the corresponding digit in the OTP array.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value.replace(/\D/, "");
        if (!value) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);

        // Move to next input if not last
        if (idx < 3 && value) {
            ((inputsRef[idx + 1].current as unknown) as HTMLInputElement)?.focus();
        }
    };

    // Presses Backspace on an empty input (not the first), it clears the previous input and moves focus back.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            const newOtp = [...otp];
            newOtp[idx - 1] = "";
            setOtp(newOtp);
            ((inputsRef[idx - 1].current as unknown) as HTMLInputElement)?.focus();
        }
    };

    // Allows the user to paste a 4-digit code.
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (paste.length === 4) {
            setOtp(paste.split(""));
            ((inputsRef[3].current as unknown) as HTMLInputElement)?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/otp/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otpId,
                    otp: otp.join(""),
                }),
            });

            const data = await res.json();

            if(!res.ok) {
                setMessage(data.message || "OTP verification failed");
            } else {
                setMessage("OTP verified successfully");
                router.push("/resetPassword");
            }
        } catch {
            setMessage("Error verifying OTP")
        }
    };

    const handleResend = async () => {
        if (!email) {
            setMessage("Email not found");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/otp/send`, {
                method: "GET",
                headers: {
                    recipient: email,
                },
            });

            const data = await res.json();

            if (!res.ok || !data.otpId) {
                setMessage(data.message || "Failed to resend OTP");
                return;
            } 

            localStorage.setItem("otpId", data.otpId);
            setOtpId(data.otpId);
            setOtp(["", "", "", ""]);
            setMessage("OTP resent successfully");

            (inputsRef[0].current as unknown as HTMLInputElement)?.focus();
        } catch {
            setMessage("Error resending OTP");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-300 max-w-[450px]">
                <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                    Verify Your Email
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    We have sent a 4-digit OTP to your email address. Please enter it below to verify your account.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center space-x-4 mb-4">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={inputsRef[idx]}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, idx)}
                                onKeyDown={(e) => handleKeyDown(e, idx)}
                                onPaste={handlePaste}
                                className="w-12 h-14 text-2xl text-center border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                            />
                        ))}
                    </div>

                    <GradientButton btnLabel="Verify Email" className="w-full mt-4" />

                </form>
                {message && (
                    <div className="mt-4 text-green-600 text-center">{message}</div>
                )}
                <div className="mt-6 text-center">
                    <span className="text-gray-600">Didn&apos;t receive the code?</span>
                    <button
                        type="button"
                        className="ml-2 text-purple-600 hover:underline font-semibold"
                        onClick={handleResend}
                    >
                        Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VerifyAccount;