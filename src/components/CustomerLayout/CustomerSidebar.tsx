import { FaUser, FaLock } from "react-icons/fa"; 
import { MdAssignmentInd } from "react-icons/md";
import { HiBookmark, HiSearch } from "react-icons/hi"; // Added HiSearch for browse
import React from "react";
import { usePathname } from "next/navigation";

interface CustomerSidebarProps {
  activeSection: string;
}

export default function CustomerSidebar({ activeSection }: CustomerSidebarProps) {
  const pathname = usePathname();
  const currentSection = pathname.startsWith('/customer/dashboard') ? 'dashboard'
    : pathname.startsWith('/customer/service') ? 'service'
    : pathname.startsWith('/customer/profile') ? 'profile'
    : activeSection;

  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <>
            <a
              href="/customer/dashboard/overview"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/dashboard/overview' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <MdAssignmentInd className="text-2xl" />
              Overview
            </a>
          </>
        );
      case 'service':
        return (
          <>
            <a
              href="/customer/service/browse"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/service/browse' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <HiSearch className="text-2xl" />
              Browse Services
            </a>
            <a
              href="/customer/service/my-bookings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/service/my-bookings' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <HiBookmark className="text-2xl" />
              My Bookings
            </a>
          </>
        );
      case 'profile':
        return (
          <>
            <a
              href="/customer/profile/edit-profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/profile/edit-profile' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaUser className="text-m" />
              Profile
            </a>
            <a
              href="/customer/profile/change-password"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/profile/change-password' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaLock className="text-m" />
              Change password
            </a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[280px] flex-shrink-0 bg-white border-2 border-gray-300 min-h-full mt-12 ml-8 mb-8 shadow-lg">
      <div className="p-6">
        <nav className="space-y-2">
          {renderSidebarContent()}
        </nav>
      </div>
    </div>
  );
}