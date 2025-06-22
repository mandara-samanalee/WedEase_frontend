import React from "react";
import VendorSignupForm from "@/section/VendorSignupForm";
import vendorRegister from "@/assets/images/vendor-register.jpg";

export default function VendorRegister() {
    return (
        <div className="mb-6">
            <div className="text-[45px] font-bold text-purple-700 text-center mb-6 mt-10">
                Join our trusted network and grow your business with dream weddings!
            </div>
            <div className="flex h-screen">
                <div className="w-1/2 h-full flex pl-14">
                    <img
                        src={vendorRegister.src}
                        alt="Wedding image"
                        className="object-cover w-full h-full rounded-l-lg"
                    />
                </div>
                <div className="w-1/2 h-full flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <VendorSignupForm />
                    </div>
                </div>
            </div>
        </div>
    );
}  