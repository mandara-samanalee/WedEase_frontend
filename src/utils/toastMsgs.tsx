"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#374151",
          borderRadius: "10px",
          padding: "12px 16px",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        },
        success: {
          iconTheme: { primary: "#10B981", secondary: "#fff" },
          style: { border: "1px solid #10B981" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#fff" },
          style: { border: "1px solid #EF4444" },
        },
      }}
    />
  );
}