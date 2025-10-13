import React from "react";
import VendorSignupForm from "@/section/VendorSignupForm";
import { Toaster } from "react-hot-toast";

export default function VendorRegister() {
    return (
        <div>
            <Toaster position="top-center"
                toastOptions={{
                    style: {
                        minWidth: "300px",
                    }
                }} />
            <div className="text-[45px] font-bold text-purple-700 text-center">
                Join our trusted network and grow your business with dream weddings!
            </div>

            <div className="w-full mt-8 mb-6 min-h-screen flex items-center justify-center">
                <VendorSignupForm />
            </div>
        </div>
    );
}  