/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FaUser, FaLock, FaCalendar, FaList, FaCheckSquare, FaUsers, FaChevronDown, FaChevronRight, FaDonate, FaIdCard, FaBell } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ServiceFilters {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
}

interface CustomerSidebarProps {
  activeSection: string;
  serviceFilters?: ServiceFilters;
}

// categories loaded from backend (fallback to a few defaults)
const DEFAULT_CATEGORIES = ["Catering", "Poruwa", "Photography & Videography", "Decorations", "Music & Entertainment", "Transportation", "Floral Arrangements", "Wedding Planning", "Other"];

export default function CustomerSidebar({ activeSection, serviceFilters }: CustomerSidebarProps) {
  const pathname = usePathname();

  // categories state + fetch must be inside component 
  const [categories, setCategories] = useState<string[]>(["All", ...DEFAULT_CATEGORIES]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/category/all`, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        const json = await res.json();
        const raw = Array.isArray(json) ? json : json?.data ?? json?.categories ?? [];
        const names = (raw || [])
          .map((c: any) => {
            const rawName = (c.name ?? c.categoryName ?? "").toString().trim();
            if (!rawName) return "";
            return rawName.charAt(0).toUpperCase() + rawName.slice(1);
          })
          .filter(Boolean);
        //const unique = Array.from(new Set(["All", ...names, ...DEFAULT_CATEGORIES]));
        // prefer API categories; fall back to defaults only when API returns none
        const unique = names.length ? Array.from(new Set(["All", ...names])) : ["All", ...DEFAULT_CATEGORIES];
        if (mounted) setCategories(unique);
      } catch (err) {
        console.error("Failed to load service categories", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const [expandedSections, setExpandedSections] = useState({
    weddingEvent: false,
    agenda: false,
    checklist: false,
    budget: false,
    rsvp: false,
    services: false,
  });

  const currentSection = pathname.startsWith('/customer/dashboard') ? 'dashboard'
    : pathname.startsWith('/customer/service') ? 'service'
      : pathname.startsWith('/customer/profile') ? 'profile'
        : activeSection;

  // Early exit: hide entirely on vendor routes
  if (pathname.startsWith('/vendor/')) {
    return null;
  }

  // Toggle function for expanding/collapsing sections
  const toggleSection = (section: keyof typeof expandedSections) =>
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  const serviceFiltersUI = () => {
    if (!serviceFilters) return null;
    const {
      priceRange, setPriceRange,
      selectedCategories, setSelectedCategories,
      //minRating, setMinRating
    } = serviceFilters;

    // Scale for price slider (0-300 corresponds to 0-300,000 LKR)
    const scale = 1000;

    const toggleCategory = (cat: string) => {
      if (cat === "All") {
        setSelectedCategories([]);
        return;
      }
      if (selectedCategories.includes(cat)) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      } else {
        setSelectedCategories([...selectedCategories, cat]);
      }
    };

    return (
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Filters</h3>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="font-medium mb-3 text-sm text-gray-700 uppercase tracking-wide">Price range</h4>
          <div className="flex justify-between text-[14px] text-gray-600 mb-1">
            <span>LKR {(priceRange[0] / scale).toFixed(0)}K</span>
            <span>LKR {(priceRange[1] / scale).toFixed(0)}K</span>
          </div>
          <div className="relative h-8">
            <input
              type="range"
              min={0}
              max={300}
              value={priceRange[0] / scale}
              onChange={e =>
                setPriceRange([Math.min(Number(e.target.value) * scale, priceRange[1] - scale), priceRange[1]])
              }
              className="absolute w-full accent-purple-500"
            />

            <input
              type="range"
              min={0}
              max={300}
              value={priceRange[1] / scale}
              onChange={e =>
                setPriceRange([priceRange[0], Math.max(Number(e.target.value) * scale, priceRange[0] + scale)])
              }
              className="absolute w-full accent-purple-700"
            />
            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-purple-100 rounded pointer-events-none" />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-medium mb-3 text-xs text-gray-700 uppercase tracking-wide">Category</h4>
          <div className="space-y-1">
            {categories.map(cat => {
              const checked =
                cat === "All"
                  ? selectedCategories.length === 0
                  : selectedCategories.includes(cat);
              return (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-gray-500 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-[14px] text-gray-700">{cat}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <>
            {/* Overview (no sub-sections) */}
            <a
              href="/customer/dashboard/overview"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/overview' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
            >
              <FaIdCard className="text-xl" />
              Overview
            </a>
            {/* Wedding Event */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('weddingEvent')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaCalendar className="text-xl" />
                Wedding Event
                {expandedSections.weddingEvent ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.weddingEvent && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/wedding-event/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/wedding-event/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Create Event
                  </a>
                  <a
                    href="/customer/dashboard/wedding-event/view"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/wedding-event/view' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    View Event
                  </a>
                </div>
              )}
            </div>
            {/* Agenda */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('agenda')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaList className="text-xl" />
                Agenda
                {expandedSections.agenda ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.agenda && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/agenda/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/agenda/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Create Agenda
                  </a>

                </div>
              )}
            </div>
            {/* Checklist */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('checklist')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaCheckSquare className="text-xl" />
                Checklist
                {expandedSections.checklist ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.checklist && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/checklist/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/checklist/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Create Checklist
                  </a>
                </div>
              )}
            </div>
            {/* Services */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('services')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <IoSparkles className="text-xl" />
                Bookings
                {expandedSections.services ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.services && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/services/selection"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/services/selection'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Booking List
                  </a>
                </div>
              )}
            </div>
            {/* Budget */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('budget')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaDonate className="text-xl" />
                Budget
                {expandedSections.budget ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.budget && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/budget/allocation"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/budget/allocation' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Budget Allocation
                  </a>

                </div>
              )}
            </div>
            {/* RSVP */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('rsvp')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaUsers className="text-xl" />
                RSVP
                {expandedSections.rsvp ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.rsvp && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/rsvp/guest-list"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/rsvp/guest-list' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Guest List
                  </a>

                  <a
                    href="/customer/dashboard/rsvp/responses"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/rsvp/responses' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                  >
                    Responses
                  </a>
                </div>
              )}

              <a
                href="/customer/dashboard/notifications"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/dashboard/notifications' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
              >
                <FaBell className="text-xl" />
                Notification Center
              </a>
            </div>
          </>
        );
      case 'service':
        // REPLACED: now the filter sidebar
        return serviceFiltersUI();
      case 'profile':
        return (
          <>
            <a
              href="/customer/profile/edit-profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/profile/edit-profile' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
            >
              <FaUser className="text-m" />
              Profile
            </a>
            <a
              href="/customer/profile/change-password"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${pathname === '/customer/profile/change-password' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
            >
              <FaLock className="text-m" />
              Change Password
            </a>
          </>
        );
      default:
        return null;
    }
  };

  const content = renderSidebarContent();
  if (!content) return null;

  return (
    <div className={`w-[300px] flex-shrink-0 bg-white border-2 border-gray-300 min-h-screen ${currentSection === 'service' ? 'mt-2 ml-4' : 'mt-12 ml-8'} ml-8 mb-8 shadow-lg`}>
      <div className="p-8">
        <nav className="space-y-2">
          {content}
        </nav>
      </div>
    </div>
  );
}