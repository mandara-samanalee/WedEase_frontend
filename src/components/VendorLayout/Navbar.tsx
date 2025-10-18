'use client'
import Image from "next/image";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiDiamondRing } from "react-icons/gi";
import socket from "@/utils/socket";

interface NavbarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>("");
    const [userImage, setUserImage] = useState<string>("");
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [userId, setUserId] = useState<string>("");

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Setup mounted state
    useEffect(() => setMounted(true), []);

    // Close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Load user info from localStorage
    useEffect(() => {
        if (!mounted) return;
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                const email = parsed.email || parsed.user?.email || "";
                const image = parsed.image || parsed.user?.image || "";
                const id = parsed.userId || parsed.user?.userId || "";
                if (email) setUserEmail(email);
                if (image) setUserImage(image);
                if (id) setUserId(id);
            }
        } catch (error) {
            console.error("Error loading user info:", error);
        }
    }, [mounted]);

    // Fetch unread notifications count on page load
    useEffect(() => {
        if (!userId) return;
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/notification/${userId}/unread-count`);
                const data = await res.json();
                if (data.success) {
                    setNotificationCount(data.unreadCount);
                }
            } catch (err) {
                console.error("Failed to fetch unread count:", err);
            }
        };
        fetchUnreadCount();
    }, [userId]);

    // Listen for real-time notifications via Socket.IO
    useEffect(() => {
        if (!userId) return;

        // Join personal room
        socket.emit("join", userId);

        // Listen for new notifications
        const handleNotification = () => setNotificationCount(prev => prev + 1);
        socket.on("notification", handleNotification);

        return () => {
            socket.off("notification", handleNotification);
        };
    }, [userId]);

    const handleNavigation = (section: string) => {
        setActiveSection(section);
        if (section === 'services') {
            router.push('/vendor/services/service-profile');
        } else if (section === 'profile') {
            router.push('/vendor/profile/edit-profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const isServicesActive = mounted ? pathname.startsWith('/vendor/services') : activeSection === 'services';
    const isProfileActive = mounted ? pathname.startsWith('/vendor/profile') : activeSection === 'profile';

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
                        onClick={() => handleNavigation('services')}
                        className={`font-medium transition ${isServicesActive ? 'text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}
                    >
                        Services
                    </button>

                    <button
                        onClick={() => handleNavigation('profile')}
                        className={`font-medium transition ${isProfileActive ? 'text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}
                    >
                        Profile
                    </button>
                </div>

                {/* Right side icons */}
                <div className="flex items-center gap-4 z-10">
                    {/* Notification Icon */}
                    <button
                        aria-label="Notifications"
                        onClick={() => router.push('/vendor/services/notifications')}
                        className="relative p-1 group"
                    >
                        <FaBell className="text-2xl text-purple-700 group-hover:text-purple-900 transition" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Icon */}
                    <div className="relative" ref={menuRef}>
                        <button
                            aria-label="Open Profile menu"
                            onClick={() => setMenuOpen(o => !o)}
                            className="flex items-center group p-1"
                        >
                            {userImage ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-700 group-hover:border-purple-900 transition">
                                    <Image
                                        src={userImage}
                                        alt="user Profile"
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                            ) : (
                                <FaUserCircle className="text-3xl text-purple-700 group-hover:text-purple-900 transition" />
                            )}
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg ring-1 ring-black/5 bg-white/90 backdrop-blur-sm border border-purple-100">
                                <div className="px-4 py-3 border-b border-purple-100">
                                    <p className="text-sm font-semibold text-purple-800">Signed in</p>
                                    <p className="text-xs text-purple-500 truncate">{userEmail || "—"}</p>
                                </div>
                                <ul className="py-1 text-sm">
                                    <li>
                                        <button
                                            onClick={() => { setMenuOpen(false); handleNavigation("profile"); }}
                                            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                                        >
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { setMenuOpen(false); router.push("/vendor/profile/settings"); }}
                                            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700"
                                        >
                                            Settings
                                        </button>
                                    </li>
                                </ul>
                                <div className="border-t border-purple-100">
                                    <button
                                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
