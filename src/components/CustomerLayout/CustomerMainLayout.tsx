"use client"
import React, { useState } from "react";
import CustomerNavbar from "@/components/CustomerLayout/CustomerNavbar"; 
import CustomerSidebar from "@/components/CustomerLayout/CustomerSidebar"; 
import ToastProvider from "@/utils/toastMsgs";
// import PageBottom from "@/components/MainLayout/PageBottom"; 

export default function CustomerMainLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('dashboard'); 

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CustomerNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1">
        <CustomerSidebar activeSection={activeSection} />
        <main className="flex-1 ml-12 mt-12">
          <ToastProvider />
          {children}
        </main>
      </div>
      {/* <PageBottom /> */}
    </div>
  );
}