import { FaUser, FaLock } from "react-icons/fa";

export default function Sidebar() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-white border border-gray-200 rounded-xl py-12 mt-10">
           {/*  <div className="bg-white border border-gray-200 rounded-xl shadow-xl w-80 p-8"> */}
                <nav className="space-y-4">
                    {/* Active Link */}
                    <a
                        href="#"
                        className="flex items-center gap-4 px-6 py-4 rounded-lg bg-purple-600 text-white font-bold text-xl shadow transition-all"
                    >
                        <FaUser className="text-2xl" />
                        Profile
                    </a>
                    {/* Inactive Link */}
                    <a
                        href="#"
                        className="flex items-center gap-4 px-6 py-4 rounded-lg text-purple-900 font-semibold text-xl hover:bg-purple-100 hover:text-purple-700 transition-all"
                    >
                        <FaLock className="text-2xl" />
                        Change password
                    </a>
                </nav>
            </div>
       // </div>
    );
}