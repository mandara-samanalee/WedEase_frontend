"use client"
import React, { useState } from "react";
import AdminNavbar from "@/components/AdminLayout/AdminNavbar";
import AdminSidebar from "@/components/AdminLayout/AdminSidebar";
import ToastProvider from "@/utils/toastMsgs";

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
    const [activeSection, setActiveSection] = useState('dashboard');

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <AdminNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex flex-1">
                <AdminSidebar activeSection={activeSection} />
                <main className="flex-1 ml-12 mt-12">
                    <ToastProvider />
                    {children}
                </main>
            </div>
        </div>
    );
}