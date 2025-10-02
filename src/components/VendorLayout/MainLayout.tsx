"use client"
import React, { useState } from "react";
import Navbar from "@/components/VendorLayout/Navbar";
import Sidebar from "@/components/VendorLayout/Sidebar";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('services');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1">
        <Sidebar activeSection={activeSection} />
        <main className="flex-1 ml-12 mt-12">
          {children}
          <Toaster
            position="top-right"
            containerStyle={{ top: "2.5rem", right: "1.25rem" }}
            toastOptions={{ duration: 4500 }}
          />
        </main>
      </div>
      {/* <PageBottom /> */}
    </div>
  );
}