'use client'
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiDiamondRing } from "react-icons/gi";
interface CustomerNavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function CustomerNavbar({ activeSection, setActiveSection }: CustomerNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userImage, setUserImage] = useState<string>("");
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

  // Load email from localstorage user object
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const email = parsed.email || parsed.user.email || "";
        const image = parsed.image || parsed.user?.image || "";
        if (email) setUserEmail(email);
        if (image) setUserImage(image);
      }
    } catch (error) {
      console.error("Error loading admin email:", error);
    }
  }, [mounted]);

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    if (section === 'dashboard') {
      router.push('/customer/dashboard/overview');
    } else if (section === 'service') {
      router.push('/customer/service/browse');
    } else if (section === 'profile') {
      router.push('/customer/profile/edit-profile');
    }
  };

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isDashboardActive = mounted ? pathname.startsWith('/customer/dashboard') : activeSection === 'dashboard';
  const isServiceActive = mounted ? pathname.startsWith('/customer/service') : activeSection === 'service';
  const isProfileActive = mounted ? pathname.startsWith('/customer/profile') : activeSection === 'profile';

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
            className={`font-medium transition ${isDashboardActive ? 'text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}
          >
            Dashboard
          </button>

          <button
            onClick={() => handleNavigation('service')}
            className={`font-medium transition ${isServiceActive ? 'text-purple-900' : 'text-purple-400 hover:text-purple-700'}`}
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

        {/* Profile Icon + dropdown */}
        <div className="z-10 absolute right-0" ref={menuRef}>
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
                      router.push("/vendor/profile/settings");
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