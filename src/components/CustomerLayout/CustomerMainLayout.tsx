"use client"
import React, { useState, useEffect } from "react";
import CustomerNavbar from "@/components/CustomerLayout/CustomerNavbar"; 
import CustomerSidebar from "@/components/CustomerLayout/CustomerSidebar"; 
import ToastProvider from "@/utils/toastMsgs";
import { usePathname } from "next/navigation";
// import PageBottom from "@/components/MainLayout/PageBottom"; 

export default function CustomerMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('dashboard'); 

   // Derive active section from route (keeps navbar highlight correct on navigation)
  useEffect(() => {
    if (pathname.startsWith("/customer/service")) setActiveSection("service");
    else if (pathname.startsWith("/customer/profile")) setActiveSection("profile");
    else if (pathname.startsWith("/customer/dashboard")) setActiveSection("dashboard");
  }, [pathname]);

  // Only show sidebar for /customer/* pages
  const showSidebar = pathname.startsWith("/customer/");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CustomerNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1">
        { showSidebar && <CustomerSidebar activeSection={activeSection} />}
        <main
          className={
            "flex-1 mt-12 " +
            (showSidebar ? "ml-12 pr-8" : "mx-auto w-full max-w-6xl px-6")
          }
          >
          <ToastProvider />
          {children}
        </main>
      </div>
      {/* <PageBottom /> */}
    </div>
  );
}