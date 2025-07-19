import { FaUserCircle } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavigation = (section: string) => {
        setActiveSection(section);
        if (section === 'services') {
            router.push('/vendor/services/service-profile');
        } if (section === 'profile') {
            router.push('/vendor/profile/edit-profile');
        }
    };

    // Use activeSection prop instead of pathname for initial render to avoid hydration mismatch
    const isServicesActive = mounted ? pathname.startsWith('/vendor/services') : activeSection === 'services';
    const isProfileActive = mounted ? pathname.startsWith('/vendor/profile') : activeSection === 'profile';

    return (
        <nav className="w-full bg-purple-100 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
                {/* Logo */}
                <div className="text-2xl font-bold text-purple-800 tracking-wide z-10 ">WedEase</div>

                {/* Navigation Links */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-12">
                    <button
                        onClick={() => handleNavigation('services')}
                        className={`font-medium transition ${isServicesActive
                                ? 'text-purple-900'
                                : 'text-purple-400 hover:text-purple-700'
                            }`}
                    >
                        Services
                    </button>

                    <button
                        onClick={() => handleNavigation('profile')}
                        className={`font-medium transition ${isProfileActive
                                ? 'text-purple-900'
                                : 'text-purple-400 hover:text-purple-700'
                            }`}
                    >
                        Profile
                    </button>
                </div>

                {/* Profile Icon */}
                <div className="z-10 absolute right-0">
                    <FaUserCircle className="text-3xl text-purple-700 hover:text-purple-900 cursor-pointer"
                        onClick={() => handleNavigation('profile')}
                    />
                </div>
            </div>
        </nav>
    );
}