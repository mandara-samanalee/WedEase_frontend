"use client"
import React, { useState } from "react";
import Navbar from "@/components/MainLayout/Navbar";
import Sidebar from "@/components/MainLayout/Sidebar";
import ToastProvider from "@/utils/toastMsgs";
//import PageBottom from "@/components/MainLayout/PageBottom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('services');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1">
        <Sidebar activeSection={activeSection} />
        <main className="flex-1 ml-12 mt-12">
          <ToastProvider />
        {children}
        </main>
      </div>
      {/* <PageBottom /> */}
    </div>
  );
}