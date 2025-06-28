import { FaUserCircle } from "react-icons/fa";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
    return (
        <nav className="w-full bg-purple-100 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
                {/* Logo */}
                <div className="text-2xl font-bold text-purple-800 tracking-wide z-10">WedEase</div>

                {/* Navigation Links */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-8">
                <button 
                        onClick={() => setActiveSection('dashboard')}
                        className={`font-medium transition ${activeSection === 'dashboard' ? 'text-purple-700' : 'text-purple-900 hover:text-purple-700'}`}
                    >
                        Dashboard
                    </button>

                    <button 
                        onClick={() => setActiveSection('service')}
                        className={`font-medium transition ${activeSection === 'service' ? 'text-purple-700' : 'text-purple-900 hover:text-purple-700'}`}
                    >
                        Service
                    </button>

                    <button 
                        onClick={() => setActiveSection('profile')}
                        className={`font-medium transition ${activeSection === 'profile' ? 'text-purple-700' : 'text-purple-900 hover:text-purple-700'}`}
                    >
                        Profile
                    </button>
                </div>

                {/* Profile Icon */}
                <div className="z-10 absolute right-0">
                <FaUserCircle className="text-3xl text-purple-700 hover:text-purple-900 cursor-pointer" />
                </div>
            </div>
        </nav>
    );
}