import { FaUser, FaLock, FaCalendar } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
import { HiBookmark } from "react-icons/hi";
import React from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
    activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
    const pathname = usePathname();
    // Determine active section from pathname 
    const currentSection = pathname.startsWith('/vendor/services') ? 'services'
        : pathname.startsWith('/vendor/profile') ? 'profile'
            : activeSection;

    const renderSidebarContent = () => {
        switch (currentSection) {
            case 'services':
                return (
                    <>
                        <a
                            href="/vendor/services/service-profile"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/vendor/services/service-profile'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <MdAssignmentInd className="text-2xl" />
                            Service Profile
                        </a>

                        <a
                            href="/vendor/services/booked-services"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/vendor/services/booked-services'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <HiBookmark className="text-2xl" />
                            Booking Details
                        </a>

                        <a
                            href="/vendor/services/booking-requests"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/vendor/services/booking-requests'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <FaCalendar className="text-lg" />
                            Booking Requests
                        </a>
                    </>
                );
            case 'profile':
                return (
                    <>
                        <a
                            href="/vendor/profile/edit-profile"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/vendor/profile/edit-profile'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                                }`}
                        >
                            <FaUser className="text-m" />
                            Profile
                        </a>

                        <a
                            href="/vendor/profile/change-password"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/vendor/profile/change-password'
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
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