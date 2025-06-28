import { FaUser, FaLock, FaCalendar, FaCamera, FaMusic, FaChartBar } from "react-icons/fa";

interface SidebarProps {
  activeSection: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
    const renderSidebarContent = () => {
        switch (activeSection) {
            case 'service':
                return (
                    <>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold text-m shadow-sm transition-all"
                        >
                            <FaCamera className="text-m" />
                            Photography
                        </a>
                        
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold text-m hover:bg-purple-50 hover:text-purple-700 transition-all"
                        >
                            <FaMusic className="text-m" />
                            Music & DJ
                        </a>
                        
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold text-m hover:bg-purple-50 hover:text-purple-700 transition-all"
                        >
                            <FaCalendar className="text-m" />
                            Event Planning
                        </a>
                    </>
                );
             case 'dashboard':
                return (
                    <>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold text-m shadow-sm transition-all"
                        >
                            <FaChartBar className="text-m" />
                            Overview
                        </a>
                        
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold text-m hover:bg-purple-50 hover:text-purple-700 transition-all"
                        >
                            <FaCalendar className="text-m" />
                            Recent Activities
                        </a>
                    </>
                );
                default: // profile
                return (
                    <>
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600 text-white font-semibold text-m shadow-sm transition-all"
                        >
                            <FaUser className="text-m" />
                            Profile
                        </a>
                        
                        <a
                            href="#"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-semibold text-m hover:bg-purple-50 hover:text-purple-700 transition-all"
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