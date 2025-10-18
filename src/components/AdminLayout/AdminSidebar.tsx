import { FaUser, FaLock, FaUsers } from "react-icons/fa";
import { MdDashboard, MdCategory, MdStore } from "react-icons/md";
import React from "react";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
    activeSection: string;
}

export default function AdminSidebar({ activeSection }: AdminSidebarProps) {
    const pathname = usePathname();
    // Determine active section from pathname 
    const currentSection = pathname.startsWith('/admin/dashboard') ? 'dashboard'
        : pathname.startsWith('/admin/profile') ? 'profile'
            : activeSection;

    const renderSidebarContent = () => {
        switch (currentSection) {
            case 'dashboard':
                return (
                    <>
                        <a
                            href="/admin/dashboard/overview"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/dashboard/overview'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <MdDashboard className="text-xl" />
                            Dashboard Overview
                        </a>

                        <a
                            href="/admin/dashboard/categories"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/dashboard/categories'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <MdCategory className="text-xl" />
                            Service Categories
                        </a>

                        <a
                            href="/admin/dashboard/vendors"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/dashboard/vendors'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <MdStore className="text-xl" />
                            Vendor Management
                        </a>

                        <a
                            href="/admin/dashboard/customer"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/dashboard/customer'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <FaUsers className="text-xl" />
                            Customer Management
                        </a>
                    </>
                );
            case 'profile':
                return (
                    <>
                        <a
                            href="/admin/profile/edit-profile"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/profile/edit-profile'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <FaUser className="text-m" />
                            Profile
                        </a>

                        <a
                            href="/admin/profile/change-password"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/admin/profile/change-password'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <FaLock className="text-m" />
                            Change Password
                        </a>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-[300px] flex-shrink-0 bg-white border-2 border-gray-300 min-h-full mt-12 ml-8 mb-8 shadow-lg">
            <div className="p-6">
                <nav className="space-y-2">
                    {renderSidebarContent()}
                </nav>
            </div>
        </div>
    );
}