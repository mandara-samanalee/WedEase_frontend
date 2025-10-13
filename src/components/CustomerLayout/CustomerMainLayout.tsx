"use client"
import React, { useState, useEffect } from "react";
import CustomerNavbar from "@/components/CustomerLayout/CustomerNavbar"; 
import CustomerSidebar from "@/components/CustomerLayout/CustomerSidebar"; 
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default function CustomerMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('dashboard'); 

  // Derive active section from route 
  useEffect(() => {
    const path = pathname ?? "";
    if (path.startsWith("/customer/service")) setActiveSection("service");
    else if (path.startsWith("/customer/profile")) setActiveSection("profile");
    else if (path.startsWith("/customer/dashboard")) setActiveSection("dashboard");
  }, [pathname]);

  // Only show sidebar for /customer/* pages
  const showSidebar = (pathname ?? "").startsWith("/customer/");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CustomerNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex flex-1">
        { showSidebar && <CustomerSidebar activeSection={activeSection} /> }
        <main
          className={
            "flex-1 mt-12 " +
            (showSidebar ? "ml-12 pr-8" : "mx-auto w-full max-w-6xl px-6")
          }
          >
          {children}
          <Toaster
            position="top-right"
            containerStyle={{ top: "2.5rem", right: "1.25rem" }}
            toastOptions={{ duration: 4000 }}
          />
        </main>
      </div>
    </div>
  );
}