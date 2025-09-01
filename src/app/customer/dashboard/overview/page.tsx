"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { FileText, Calendar, CheckSquare, Users, Briefcase, CircleDollarSign, Heart, Sparkles, Gift } from "lucide-react";

type ChecklistItem = { id?: number; title?: string; done?: boolean };
type Service = { booked?: boolean; status?: string };

export default function DashboardOverviewPage() {
  const [eventTitle, setEventTitle] = useState<string>("Your Dream Wedding");
  const [eventDate, setEventDate] = useState<string>("-");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [budgetTotal, setBudgetTotal] = useState<number>(0);
  const [budgetAllocated, setBudgetAllocated] = useState<number>(0);
  const [budgetActual, setBudgetActual] = useState<number>(0);
  const [agendaCount, setAgendaCount] = useState<number>(0);
  const [checklistDone, setChecklistDone] = useState<number>(0);
  const [checklistTotal, setChecklistTotal] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);

  useEffect(() => {
    try {
      // Event
      const eventRaw = localStorage.getItem("wedeaseEvent") || localStorage.getItem("event") || localStorage.getItem("weddingEvent");
      if (eventRaw) {
        try {
          const ev = JSON.parse(eventRaw);
          setEventTitle(ev?.title || ev?.name || "Your Dream Wedding");
          setEventDate(ev?.date || ev?.day || "-");
        } catch {
          // if it's a simple string
          setEventTitle(eventRaw);
        }
      }
    } catch {}

    try {
      // Guests / RSVPs
      const raw = localStorage.getItem("wedeaseGuests");
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        setGuestCount(arr.length);
        const byStatus: Record<string, number> = {};
        interface Guest { status?: string }
        arr.forEach((g: Guest) => {
          const s = (g?.status || "unknown").toString();
          byStatus[s] = (byStatus[s] || 0) + 1;
        });
        setRsvpCounts(byStatus);
      }
    } catch {}

    try {
      // Budget
      const total = Number(localStorage.getItem("weddingBudget") || 0) || 0;
      setBudgetTotal(total);
      const catsRaw = localStorage.getItem("weddingCategoriesV2");
      const cats = catsRaw ? JSON.parse(catsRaw) : [];
      interface Category { allocated?: number; actual?: number; }
      if (Array.isArray(cats)) {
        const allocated = cats.reduce((s: number, c: Category) => s + (Number(c?.allocated) || 0), 0);
        const actual = cats.reduce((s: number, c: Category) => s + (Number(c?.actual) || 0), 0);
        setBudgetAllocated(allocated);
        setBudgetActual(actual);
      }
    } catch {}

    try {
      // Agenda 
      const aRaw = localStorage.getItem("weddingAgenda") || localStorage.getItem("wedeaseAgenda") || localStorage.getItem("agendaItems");
      const agenda = aRaw ? JSON.parse(aRaw) : [];
      setAgendaCount(Array.isArray(agenda) ? agenda.length : 0);
    } catch {}

    try {
      // Checklist
      const cRaw = localStorage.getItem("weddingChecklist") || localStorage.getItem("wedeaseChecklist") || localStorage.getItem("checklist");
      const checklist = cRaw ? JSON.parse(cRaw) : [];
      if (Array.isArray(checklist)) {
        setChecklistTotal(checklist.length);
        setChecklistDone(checklist.filter((it: ChecklistItem) => it?.done).length);
      }
    } catch {}

    try {
      // Services
      const vRaw =
        localStorage.getItem("wedeaseServices") ||
        localStorage.getItem("Services") ||
        localStorage.getItem("weddingServices");
      const services: Service[] = vRaw ? JSON.parse(vRaw) : [];
      if (Array.isArray(services)) {
        setServicesCount(
          services.filter((s) => s?.booked || s?.status === "booked").length
        );
      }
    } catch {}
  }, []);

  const checklistPct = checklistTotal ? Math.round((checklistDone / checklistTotal) * 100) : 0;
  const budgetUtilPct = budgetTotal ? Math.round((budgetActual / budgetTotal) * 100) : 0;

  const formatDate = (dateStr: string) => {
    if (dateStr === "-" || !dateStr) return "Coming Soon";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getDaysUntilWedding = () => {
    if (eventDate === "-" || !eventDate) return null;
    try {
      const wedding = new Date(eventDate);
      const today = new Date();
      const diffTime = wedding.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  const daysLeft = getDaysUntilWedding();

  return (
    <CustomerMainLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-rose-200 rounded-full opacity-25 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto pb-24 space-y-12 px-6 py-8 relative">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Wedding Planning Dashboard
              </h1>
              <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-200 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{eventTitle}</h2>
              <p className="text-xl text-gray-600 mb-4">{formatDate(eventDate)}</p>
              {daysLeft !== null && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                  <Sparkles className="w-5 h-5" />
                  {daysLeft > 0 ? `${daysLeft} days until your special day!` : "Your wedding day is here! 🎉"}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{guestCount}</div>
                  <div className="text-rose-100">Total Guests</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <CheckSquare className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{checklistPct}%</div>
                  <div className="text-purple-100">Tasks Complete</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <Briefcase className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{servicesCount}</div>
                  <div className="text-emerald-100">Services Booked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Event Details Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Event Details</h3>
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-700">{eventTitle}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {formatDate(eventDate)}
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/wedding-event/view" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4" />
                Manage Event
              </Link>
            </div>

            {/* Budget Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CircleDollarSign className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Budget Tracker</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Budget</span>
                      <span className="font-bold text-emerald-600">LKR {budgetTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Allocated</span>
                      <span className="font-semibold text-gray-700">LKR {budgetAllocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Spent</span>
                      <span className="font-semibold text-gray-700">LKR {budgetActual.toLocaleString()}</span>
                    </div>
                    
                    {/* Budget Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Budget Utilization</span>
                        <span>{budgetUtilPct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            budgetUtilPct <= 70 ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                            budgetUtilPct <= 90 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${Math.min(budgetUtilPct, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/budget/allocation" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CircleDollarSign className="w-4 h-4" />
                Manage Budget
              </Link>
            </div>

            {/* RSVP Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Guest Responses</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{guestCount} Guests</div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                      <div className="text-lg font-bold text-green-600">{rsvpCounts["confirmed"] || 0}</div>
                      <div className="text-xs text-green-700">Confirmed</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                      <div className="text-lg font-bold text-yellow-600">{rsvpCounts["pending"] || 0}</div>
                      <div className="text-xs text-yellow-700">Pending</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                      <div className="text-lg font-bold text-red-600">{rsvpCounts["declined"] || 0}</div>
                      <div className="text-xs text-red-700">Declined</div>
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/rsvp/responses" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Users className="w-4 h-4" />
                View Responses
              </Link>
            </div>

            {/* Agenda Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Wedding Timeline</h3>
                  <div className="text-3xl font-bold text-amber-600 mb-2">{agendaCount} Events</div>
                  <p className="text-gray-600">Perfect day scheduling</p>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/agenda/create" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText className="w-4 h-4" />
                Edit Timeline
              </Link>
            </div>

            {/* Checklist Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Wedding Checklist</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-blue-600">{checklistDone}/{checklistTotal}</span>
                    <span className="text-gray-600">tasks completed</span>
                  </div>
                  
                  {/* Progress Circle */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - checklistPct / 100)}`}
                        className="text-blue-500 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">{checklistPct}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/checklist/create" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CheckSquare className="w-4 h-4" />
                Edit Checklist
              </Link>
            </div>

            {/* Services Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-violet-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Wedding Services</h3>
                  <div className="text-3xl font-bold text-violet-600 mb-2">{servicesCount}</div>
                  <p className="text-gray-600">Services booked</p>
                  <div className="mt-3 text-sm text-gray-500">
                    Photographers, caterers, venues & more
                  </div>
                </div>
              </div>
              <Link 
                href="/customer/dashboard/services/selection" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Briefcase className="w-4 h-4" />
                Manage Services
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 rounded-3xl p-8 border border-pink-200 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-rose-500" />
              <Sparkles className="w-6 h-6 text-purple-500" />
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Perfect Day Awaits!
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Every detail you plan today brings you closer to the magical moment you've dreamed of. 
              Take your time, enjoy the process, and remember that love is what makes everything perfect.
            </p>
          </div>
        </div>

        {/* Floating Hearts Animation */}
        <div className="fixed bottom-10 right-10 pointer-events-none">
          <div className="relative">
            <Heart className="w-6 h-6 text-rose-400 absolute animate-bounce" style={{ animationDelay: '0s' }} />
            <Heart className="w-4 h-4 text-pink-400 absolute left-8 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <Heart className="w-5 h-5 text-purple-400 absolute left-4 top-6 animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}