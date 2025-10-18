"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { FileText, Calendar, CheckSquare, Users, Briefcase, CircleDollarSign, Heart, Sparkles, Gift, Loader } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface EventDetails {
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  guestCount: number;
}

interface GuestResponseCounts {
  confirmed: number;
  pending: number;
  declined: number;
  invited: number;
  prelisted: number;
}

interface BookedServicesSummary {
  totalBookings: number;
  accepted: number;
  pending: number;
  completed: number;
}

interface BudgetSummary {
  totalBudget: number;
  allocatedBudget: number;
  spentBudget: number;
  remainingBudget: number;
}

interface DashboardData {
  eventDetails: EventDetails | null;
  totalGuests: number;
  guestResponseCounts: GuestResponseCounts;
  taskCompletedPercentage: string;
  bookedServicesSummary: BookedServicesSummary;
  budgetSummary: BudgetSummary | null;
  timelineTaskCount: number;
  completedChecklistTasks: number;
}

export default function DashboardOverviewPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserId = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user?.userId || user?.id || null;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  };

  const getToken = () => localStorage.getItem("token") || "";

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const token = getToken();

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/customer/get-event-details/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();

      if (result.status && result.data) {
        setDashboardData(result.data);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Coming Soon";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Coming Soon";
    }
  };

  const getDaysUntilWedding = () => {
    if (!dashboardData?.eventDetails?.date) return null;
    try {
      const wedding = new Date(dashboardData.eventDetails.date);
      const today = new Date();
      const diffTime = wedding.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your wedding dashboard...</p>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  if (!dashboardData) {
    return (
      <CustomerMainLayout>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
            <p className="text-gray-600 mb-4">There was an error loading your wedding details.</p>
            <button
              onClick={fetchDashboardData}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  const daysLeft = getDaysUntilWedding();
  const checklistPct = parseFloat(dashboardData.taskCompletedPercentage || "0");
  const budgetUtilPct = dashboardData.budgetSummary?.totalBudget
    ? Math.round((dashboardData.budgetSummary.spentBudget / dashboardData.budgetSummary.totalBudget) * 100)
    : 0;

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

            {dashboardData.eventDetails ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-200 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{dashboardData.eventDetails.title || "Your Wedding"}</h2>
                <p className="text-lg text-gray-600 mb-2">
                  {dashboardData.eventDetails.groomName || "Groom"} & {dashboardData.eventDetails.brideName || "Bride"}
                </p>
                <p className="text-xl text-gray-600 mb-4">{formatDate(dashboardData.eventDetails.date)}</p>
                {daysLeft !== null && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                    <Sparkles className="w-5 h-5" />
                    {daysLeft > 0 ? `${daysLeft} days until your special day!` : "Your wedding day is here! 🎉"}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-pink-200 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Wedding Dashboard</h2>
                <p className="text-gray-600 mb-4">Create your wedding event to get started</p>
                <Link 
                  href="/customer/dashboard/wedding-event/create"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Event
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{dashboardData.totalGuests || 0}</div>
                  <div className="text-rose-100">Total Guests</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <CheckSquare className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{checklistPct.toFixed(0)}%</div>
                  <div className="text-purple-100">Tasks Complete</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <Briefcase className="w-8 h-8" />
                <div>
                  <div className="text-2xl font-bold">{dashboardData.bookedServicesSummary?.totalBookings || 0}</div>
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
                  {dashboardData.eventDetails ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-700">{dashboardData.eventDetails.title || "Your Wedding"}</div>
                      <div className="text-gray-600 flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        {formatDate(dashboardData.eventDetails.date)}
                      </div>
                      <div className="text-gray-600 text-sm">
                        📍 {dashboardData.eventDetails.location || "Location TBD"}
                      </div>
                      <div className="text-gray-600 text-sm">
                        👥 {dashboardData.eventDetails.guestCount || 0} guests expected
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No event details yet</p>
                  )}
                </div>
              </div>
              <Link
                href={dashboardData.eventDetails ? "/customer/dashboard/wedding-event/view" : "/customer/dashboard/wedding-event/create"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4" />
                {dashboardData.eventDetails ? 'Manage Event' : 'Create Event'}
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
                  {dashboardData.budgetSummary?.totalBudget ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Budget</span>
                        <span className="font-bold text-emerald-600">LKR {dashboardData.budgetSummary.totalBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Allocated</span>
                        <span className="font-semibold text-gray-700">LKR {dashboardData.budgetSummary.allocatedBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-semibold text-gray-700">LKR {dashboardData.budgetSummary.spentBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Remaining</span>
                        <span className="font-bold text-green-600">LKR {dashboardData.budgetSummary.remainingBudget.toLocaleString()}</span>
                      </div>

                      {/* Budget Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Budget Utilization</span>
                          <span>{budgetUtilPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 ${budgetUtilPct <= 70 ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                                budgetUtilPct <= 90 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                  'bg-gradient-to-r from-red-400 to-red-600'
                              }`}
                            style={{ width: `${Math.min(budgetUtilPct, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">No budget set yet</p>
                      <p className="text-sm text-gray-400">Create your budget to start tracking expenses</p>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/customer/dashboard/budget/allocation"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CircleDollarSign className="w-4 h-4" />
                {dashboardData.budgetSummary?.totalBudget ? 'Manage Budget' : 'Create Budget'}
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
                  <div className="text-3xl font-bold text-purple-600 mb-2">{dashboardData.totalGuests || 0} Guests</div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-green-50 rounded-xl p-2 border border-green-200">
                      <div className="text-lg font-bold text-green-600">{dashboardData.guestResponseCounts?.confirmed || 0}</div>
                      <div className="text-xs text-green-700">Confirmed</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-2 border border-yellow-200">
                      <div className="text-lg font-bold text-yellow-600">{dashboardData.guestResponseCounts?.pending || 0}</div>
                      <div className="text-xs text-yellow-700">Pending</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-2 border border-red-200">
                      <div className="text-lg font-bold text-red-600">{dashboardData.guestResponseCounts?.declined || 0}</div>
                      <div className="text-xs text-red-700">Declined</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-2 border border-blue-200">
                      <div className="text-lg font-bold text-blue-600">{dashboardData.guestResponseCounts?.invited || 0}</div>
                      <div className="text-xs text-blue-700">Invited</div>
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

            {/* Timeline/Agenda Card */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Wedding Timeline</h3>
                  <div className="text-3xl font-bold text-amber-600 mb-2">{dashboardData.timelineTaskCount || 0} Agenda Items</div>
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
                    <span className="text-2xl font-bold text-blue-600">{dashboardData.completedChecklistTasks || 0}</span>
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
                      <span className="text-lg font-bold text-blue-600">{checklistPct.toFixed(0)}%</span>
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
                  <div className="text-3xl font-bold text-violet-600 mb-2">{dashboardData.bookedServicesSummary?.totalBookings || 0}</div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>✓ Accepted:</span>
                      <span className="font-semibold text-green-600">{dashboardData.bookedServicesSummary?.accepted || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>⏳ Pending:</span>
                      <span className="font-semibold text-yellow-600">{dashboardData.bookedServicesSummary?.pending || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✔ Completed:</span>
                      <span className="font-semibold text-purple-600">{dashboardData.bookedServicesSummary?.completed || 0}</span>
                    </div>
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
              Every detail you plan today brings you closer to the magical moment you&apos;ve dreamed of.
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