import { FaUser, FaLock, FaCalendar } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
import { HiBookmark } from "react-icons/hi";
import React, { useState } from "react";

interface SidebarProps {
    activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
    const [activeSubSection, setActiveSubSection] = useState('');

    const renderSidebarContent = () => {
        switch (activeSection) {
            case 'service':
                return (
                    <>
                        <a
                            href="#"
                            onClick={() => setActiveSubSection('photography')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                                activeSubSection === 'photography' 
                                ? 'bg-purple-600 text-white shadow-sm' 
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <MdAssignmentInd className="text-2xl" />
                            Service Profile
                        </a>

                        <a
                            href="#"
                            onClick={() => setActiveSubSection('music')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                                activeSubSection === 'music' 
                                ? 'bg-purple-600 text-white shadow-sm' 
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <HiBookmark className="text-2xl" />
                            Booked Services
                        </a>

                        <a
                            href="#"
                            onClick={() => setActiveSubSection('event-planning')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                                activeSubSection === 'event-planning' 
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
                            href="#"
                            onClick={() => setActiveSubSection('profile')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                                activeSubSection === 'profile' 
                                ? 'bg-purple-600 text-white shadow-sm' 
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <FaUser className="text-m" />
                            Profile
                        </a>

                        <a
                            href="#"
                            onClick={() => setActiveSubSection('change-password')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                                activeSubSection === 'change-password' 
                                ? 'bg-purple-600 text-white shadow-sm' 
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        >
                            <FaLock className="text-m" />
                            Change password
                        </a>
                    </>
                );
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