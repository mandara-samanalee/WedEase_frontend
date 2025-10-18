"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import Link from "next/link";
import { Trash2, CheckCircle2, Clock, ArrowLeft, MapPin, Phone, Calendar, Mail, Globe, Loader, Hourglass, CircleCheck, XCircle, Package, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type BookingStatus = "interested" | "pending" | "confirmed" | "declined" | "completed";

type ServicePackage = {
  id: number;
  packageName: string;
  price: number;
  features: string;
};

type Booking = {
  id: string;
  name: string;
  provider: string;
  category: string;
  packages?: ServicePackage[];
  status: BookingStatus;
  addedAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  locationFull?: string;
  serviceId?: string;
  customerId?: string;
  bookingDate?: string;
};

export default function ServicesSelectionPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

  const getCustomerId = useCallback(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("customer") || "{}";
      const parsed = JSON.parse(raw);
      return parsed?.userId || parsed?.id || parsed?.customerId || localStorage.getItem("customerId") || null;
    } catch {
      return localStorage.getItem("customerId") || null;
    }
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem("token") || "";
  }, []);

  const mapApiStatusToLocalStatus = (apiStatus?: string): BookingStatus => {
    if (!apiStatus) return "interested";
    switch (apiStatus.toUpperCase()) {
      case "PENDING":
        return "pending";
      case "CONFIRMED":
        return "confirmed";
      case "COMPLETED":
        return "completed";
      case "CANCELLED":
      case "DECLINED":
      case "REJECTED":
        return "declined";
      case "INTERESTED":
      default:
        return "interested";
    }
  };

  const mapLocalToApiStatus = (local: BookingStatus): string => {
    switch (local) {
      case "pending":
        return "PENDING";
      case "confirmed":
        return "CONFIRMED";
      case "completed":
        return "COMPLETED";
      case "declined":
        return "CANCELLED";
      case "interested":
      default:
        return "INTERESTED";
    }
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const customerId = getCustomerId();
      const token = getToken();

      if (!customerId) {
        setError("Customer ID not found");
        setBookings([]);
        setLoading(false);
        return;
      }

      const resp = await fetch(`${BASE_URL}/booking/customer/${customerId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch bookings: ${resp.status} ${resp.statusText}`);
      }

      const json = await resp.json();

      if (!json || !json.success || !Array.isArray(json.data)) {
        setBookings([]);
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformed: Booking[] = json.data.map((b: any) => {
        const svc = b.service || {};
        const vendor = svc.vendor || {};
        const packages = svc.packages && Array.isArray(svc.packages) ? svc.packages : [];

        return {
          id: b.id,
          name: svc.serviceName || b.serviceName || "Unnamed Service",
          provider: `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || vendor.providerName || "Unknown Provider",
          category: svc.category || b.category || "Other",
          packages: packages,
          status: mapApiStatusToLocalStatus(b.status),
          addedAt: b.createdAt || b.bookingDate || new Date().toISOString(),
          updatedAt: b.updatedAt,
          confirmedAt: b.confirmedAt,
          cancelledAt: b.cancelledAt,
          completedAt: b.completedAt,
          contactNumber: vendor.contactNo || b.contactNumber || undefined,
          email: vendor.email || b.email || undefined,
          website: b.website || undefined,
          locationFull: [
            svc.address,
            svc.city,
            (svc).distric || (svc).district,
            (svc).state || (svc).province,
            svc.country,
          ]
            .filter(Boolean)
            .join(", ") || svc.address || b.location || "Not specified",
          serviceId: svc.serviceId || b.serviceId,
          customerId: b.customerId,
          bookingDate: b.bookingDate,
        } as Booking;
      });

      setBookings(transformed);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [getCustomerId, getToken]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, newLocalStatus: BookingStatus) => {
    try {
      const token = getToken();
      const apiStatus = mapLocalToApiStatus(newLocalStatus);

      const resp = await fetch(`${BASE_URL}/booking/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookingId,
          status: apiStatus,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Failed to update booking status: ${resp.status} ${txt}`);
      }

      const json = await resp.json();
      if (!json || !json.success) {
        throw new Error(json?.message || "Failed to update booking status");
      }

      toast.success("Booking status updated successfully");
      await fetchBookings();
    } catch (err) {
      console.error("Error updating booking status:", err);
      toast.error("Failed to update booking status");
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const token = getToken();
      const resp = await fetch(`${BASE_URL}/booking/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Failed to delete booking: ${resp.status} ${txt}`);
      }

      const json = await resp.json().catch(() => null);
      if (json && json.success === false) {
        throw new Error(json.message || "Delete failed");
      }

      toast.success("Booking deleted successfully");
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error("Failed to delete booking");
    }
  };

  const toggleStatus = async (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    if (booking.status === "interested") {
      await updateBookingStatus(id, "pending");
    }
  };

  const removeItem = async (id: string) => {
    await deleteBooking(id);
  };

  const togglePackages = (bookingId: string) => {
    setExpandedPackages(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          text: "Confirmed",
          color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200",
          icon: <CheckCircle2 size={14} className="text-green-600" />,
          dot: "bg-green-500"
        };
      case "completed":
        return {
          text: "Completed",
          color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200",
          icon: <CircleCheck size={14} className="text-purple-600" />,
          dot: "bg-purple-500"
        };
      case "declined":
        return {
          text: "Declined",
          color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200",
          icon: <XCircle size={14} className="text-red-600" />,
          dot: "bg-red-500"
        };
      case "pending":
        return {
          text: "Pending",
          color: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-blue-200",
          icon: <Clock size={14} className="text-blue-600" />,
          dot: "bg-blue-500"
        };
      default:
        return {
          text: "Interested",
          color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200",
          icon: <Hourglass size={14} className="text-amber-600" />,
          dot: "bg-amber-500"
        };
    }
  };

  const getDateDisplay = (booking: Booking) => {
    switch (booking.status) {
      case "confirmed":
        return {
          label: "Confirmed",
          date: booking.confirmedAt || booking.updatedAt || booking.addedAt
        };
      case "declined":
        return {
          label: "Cancelled",
          date: booking.cancelledAt || booking.updatedAt || booking.addedAt
        };
      case "completed":
        return {
          label: "Completed",
          date: booking.completedAt || booking.updatedAt
        };
      case "pending":
        return {
          label: "Updated",
          date: booking.updatedAt || booking.addedAt
        };
      default: // interested
        return {
          label: "Created",
          date: booking.addedAt
        };
    }
  };

  const getPackageGradient = (index: number) => {
    const gradients = [
      "from-blue-50 to-indigo-100 border-blue-200",
      "from-purple-50 to-pink-100 border-purple-200",
      "from-emerald-50 to-teal-100 border-emerald-200",
      "from-amber-50 to-orange-100 border-amber-200",
      "from-rose-50 to-pink-100 border-rose-200",
      "from-cyan-50 to-sky-100 border-cyan-200",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <CustomerMainLayout>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
                My Bookings
              </h1>
              <p className="text-gray-600">Manage your service bookings</p>
            </div>
            <Link
              href="/customer/service/browse"
              className="inline-flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold"
            >
              <ArrowLeft size={20} />
              Browse More Services
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <XCircle size={20} />
                Error loading bookings
              </p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <Loader className="animate-spin w-12 h-12 text-purple-600 mb-4" />
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            )}

            {!loading && !error && !bookings.length && (
              <div className="col-span-full p-16 text-center bg-white rounded-3xl border-2 border-purple-200 shadow-xl">
                <div className="mb-6">
                  <Hourglass className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No bookings yet</h3>
                <p className="text-gray-600 mb-8 text-md">Browse our services and make your first booking to get started!</p>
                <Link
                  href="/customer/service/browse"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold text-lg"
                >
                  <Sparkles size={20} />
                  Browse Services
                </Link>
              </div>
            )}

            {bookings.map((booking) => {
              const statusInfo = getStatusDisplay(booking.status);
              const canChangeStatus = booking.status === "interested";
              const hasPackages = booking.packages && booking.packages.length > 0;
              const isExpanded = expandedPackages[booking.id];
              const canDelete = booking.status === "interested" || booking.status === "pending";
              const dateDisplay = getDateDisplay(booking);

              return (
                <div
                  key={booking.id}
                  className="bg-white border-2 border-purple-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{booking.name}</h3>
                        <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          {booking.provider}
                        </p>
                        {booking.serviceId && (
                          <p className="text-xs font-mono text-gray-500 mt-1.5 bg-gray-100 px-2 py-1 rounded-md inline-block border border-gray-200">
                            Service ID: {booking.serviceId}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-2 border-emerald-200 shadow-sm">
                        {booking.category}
                      </span>
                    </div>

                    {/* Status Badge and Date */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-full text-sm font-bold px-5 py-2.5 border-2 ${statusInfo.color} shadow-md`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.dot} animate-pulse`}></span>
                          {statusInfo.icon}
                          {statusInfo.text}
                        </span>
                      </div>
                      {dateDisplay.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 pl-1">
                          <Calendar size={16} className="text-purple-500" />
                          <span className="font-medium">
                            {dateDisplay.label}: {new Date(dateDisplay.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Packages Section */}
                    {hasPackages && (
                      <div className="space-y-3">
                        <button
                          onClick={() => togglePackages(booking.id)}
                          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-gray-900">
                              Available Packages ({booking.packages!.length})
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-purple-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-purple-600" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="space-y-3 pl-2">
                            {booking.packages!.map((pkg, index) => (
                              <div
                                key={pkg.id}
                                className={`p-4 bg-gradient-to-br ${getPackageGradient(index)} rounded-xl border-2 shadow-md transform transition-all hover:scale-102 hover:shadow-lg`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-bold text-gray-900 text-base">{pkg.packageName}</h4>
                                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                                    LKR {pkg.price.toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{pkg.features}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-3 text-sm bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-4 border-2 border-gray-200">
                      {booking.contactNumber && (
                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-purple-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{booking.contactNumber}</span>
                        </div>
                      )}

                      {booking.email && (
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-purple-600 flex-shrink-0" />
                          <span className="text-gray-700 truncate font-medium">{booking.email}</span>
                        </div>
                      )}

                      {booking.website && (
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-purple-600 flex-shrink-0" />
                          <a
                            href={booking.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed font-medium">{booking.locationFull}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/customer/service/${encodeURIComponent(booking.serviceId ?? "")}`}
                        className="flex-1 text-center px-3 py-3 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        View Details
                      </Link>
                      {canChangeStatus && (
                        <button
                          onClick={() => toggleStatus(booking.id)}
                          className="px-3 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-700 hover:from-green-100 hover:to-emerald-100 text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Book Now
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => removeItem(booking.id)}
                          className="px-3 py-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 hover:from-red-100 hover:to-rose-100 text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}