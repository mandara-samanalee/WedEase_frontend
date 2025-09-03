import { FaUserCircle } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiDiamondRing } from "react-icons/gi";
interface AdminNavbarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function AdminNavbar({ activeSection, setActiveSection }: AdminNavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminEmail, setAdminEmail] = useState<string>("");
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Load email from localstorage admin object
    useEffect(() => {
        if (!mounted) return;
        try {
            const raw = localStorage.getItem("admin");
            if (raw) {
                const parsed = JSON.parse(raw);
                const email = parsed.email || parsed.admin?.email || "admin@wedease.com";
                if (email) setAdminEmail(email);
            }
        } catch { 
            setAdminEmail("admin@wedease.com");
        }
    }, [mounted]);

    const handleNavigation = (section: string) => {
        setActiveSection(section);
        if (section === 'dashboard') {
            router.push('/admin/dashboard/overview');
        } else if (section === 'profile') {
            router.push('/admin/profile/edit-profile');
        }
    };

    // logout function
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
    };

    // Use activeSection prop instead of pathname for initial render to avoid hydration mismatch
    const isDashboardActive = mounted ? pathname.startsWith('/admin/dashboard') : activeSection === 'dashboard';
    const isProfileActive = mounted ? pathname.startsWith('/admin/profile') : activeSection === 'profile';

    return (
        <nav className="w-full bg-purple-100 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
                {/* Logo */}
                <div className="flex items-center gap-1 z-10">
                    <GiDiamondRing className="text-4xl text-purple-700" />
                    <div className="text-3xl font-bold bg-gradient-to-t from-purple-700 to-purple-400 bg-clip-text text-transparent tracking-wide">
                        WedEase
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-12">
                    <button
                        onClick={() => handleNavigation('dashboard')}
                        className={`font-medium transition ${isDashboardActive
                            ? 'text-purple-900'
                            : 'text-purple-400 hover:text-purple-700'
                            }`}
                    >
                        Dashboard
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

                {/* Profile Icon + dropdown */}
                <div className="z-10 absolute right-0" ref={menuRef}>
                    <button
                        aria-label="Open Admin menu"
                        onClick={() => setMenuOpen(o => !o)}
                        className="flex items-center group p-1"
                    >
                        <FaUserCircle className="text-3xl text-purple-700 group-hover:text-purple-900 transition" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg ring-1 ring-black/5 bg-white/90 backdrop-blur-sm border border-purple-100">
                            <div className="px-4 py-3 border-b border-purple-100">
                                <p className="text-sm font-semibold text-purple-800">Administrator</p>
                                <p className="text-xs text-purple-500 truncate">{adminEmail || "—"}</p>
                            </div>
                            <ul className="py-1 text-sm">
                                <li>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            handleNavigation("profile");
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push("/admin/profile/settings");
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                                    >
                                        Settings
                                    </button>
                                </li>
                            </ul>
                            <div className="border-t border-purple-100">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}