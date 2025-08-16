"use client";
import { FaUser, FaLock, FaCalendar, FaList, FaCheckSquare, FaUsers, FaChevronDown, FaChevronRight, FaDonate, FaIdCard } from "react-icons/fa";
import { HiBookmark, HiSearch } from "react-icons/hi";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

interface CustomerSidebarProps {
  activeSection: string;
}

export default function CustomerSidebar({ activeSection }: CustomerSidebarProps) {
  const pathname = usePathname();
  const currentSection = pathname.startsWith('/customer/dashboard') ? 'dashboard'
    : pathname.startsWith('/customer/service') ? 'service'
    : pathname.startsWith('/customer/profile') ? 'profile'
    : activeSection;

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState({
    weddingEvent: false,
    agenda: false,
    checklist: false,
    budget: false,
    rsvp: false,
  });

  // Toggle function for expanding/collapsing sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderSidebarContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <>
            {/* Overview (no sub-sections) */}
            <a
              href="/customer/dashboard/overview"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/dashboard/overview' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaIdCard className="text-2xl" />
              Overview
            </a>
            {/* Wedding Event */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection('weddingEvent')}
                className="flex items-center gap-3 px-4 py-3 w-full text-left font-semibold text-m text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                <FaCalendar className="text-2xl" />
                Wedding Event
                {expandedSections.weddingEvent ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.weddingEvent && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/wedding-event/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/wedding-event/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Create Event
                  </a>
                  <a
                    href="/customer/dashboard/wedding-event/view"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/wedding-event/view' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    View Events
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
                <FaList className="text-2xl" />
                Agenda
                {expandedSections.agenda ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.agenda && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/agenda/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/agenda/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Create Agenda
                  </a>
                  <a
                    href="/customer/dashboard/agenda/view"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/agenda/view' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    View Agenda
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
                <FaCheckSquare className="text-2xl" />
                Checklist
                {expandedSections.checklist ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.checklist && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/checklist/create"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/checklist/create' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Create Checklist
                  </a>
                  <a
                    href="/customer/dashboard/checklist/my-tasks"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/checklist/my-tasks' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    My Tasks
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
                <FaDonate className="text-2xl" />
                Budget
                {expandedSections.budget ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.budget && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/budget/allocation"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/budget/allocation' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Budget Allocation
                  </a>
                  <a
                    href="/customer/dashboard/budget/expense-tracking"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/budget/expense-tracking' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Expense Tracking
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
                <FaUsers className="text-2xl" />
                RSVP
                {expandedSections.rsvp ? <FaChevronDown className="ml-auto" /> : <FaChevronRight className="ml-auto" />}
              </button>
              {expandedSections.rsvp && (
                <div className="ml-6">
                  <a
                    href="/customer/dashboard/rsvp/guest-list"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/rsvp/guest-list' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >

                    Guest List 
                  </a>
                  <a
                    href="/customer/dashboard/rsvp/responses"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                      pathname === '/customer/dashboard/rsvp/responses' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    Responses
                  </a>
                </div>
              )}
            </div>
          </>
        );
      case 'service':
        return (
          <>
            <a
              href="/customer/service/browse"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/service/browse' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <HiSearch className="text-2xl" />
              Browse Services
            </a>
            <a
              href="/customer/service/my-bookings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/service/my-bookings' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <HiBookmark className="text-2xl" />
              My Bookings
            </a>
          </>
        );
      case 'profile':
        return (
          <>
            <a
              href="/customer/profile/edit-profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/profile/edit-profile' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaUser className="text-m" />
              Profile
            </a>
            <a
              href="/customer/profile/change-password"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-m transition-all ${
                pathname === '/customer/profile/change-password' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
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