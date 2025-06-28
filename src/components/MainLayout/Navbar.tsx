import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
    return (
        <nav className="w-full bg-purple-100">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="text-2xl font-bold text-purple-800 tracking-wide">WedEase</div>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <a href="/" className="text-purple-900 font-medium hover:text-purple-700 transition">Dashboard</a>
                    <a href="/service" className="text-purple-900 font-medium hover:text-purple-700 transition">Service</a>
                    <a href="/dashboard" className="text-purple-900 font-medium hover:text-purple-700 transition">Profile</a>
                </div>

                {/* Profile Icon */}
                <div className="ml-8">
                    <FaUserCircle className="text-3xl text-purple-700 hover:text-purple-900 cursor-pointer" />
                </div>
            </div>
        </nav>
    );
}