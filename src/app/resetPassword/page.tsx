import ResetPassword from "../../section/ResetPassword"
import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ResetPasswordPage() {
    return (
        <div>
            <Toaster position="top-center"
                toastOptions={{
                    style: {
                        minWidth: "250px",
                    }
                }} />
            <div className="justify-center items-center">
                <ResetPassword />
            </div>
        </div>
    );
}