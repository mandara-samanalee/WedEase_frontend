"use client";
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { Loader, Search, Calendar, Clock, CheckCircle, XCircle, User, Mail, Phone, MapPin, Sparkles, CheckCheck } from "lucide-react";
import { FaMapPin } from "react-icons/fa6";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BookingRequest {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  serviceName: string;
  serviceType: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  completedAt?: string | null;
}

interface ServiceWithBookings {
  id: number;
  serviceId: string;
  serviceName: string;
  category: string;
  description: string;
  capacity: string;
  isActive: boolean;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  bookings: Array<{
    id: string;
    serviceId: string;
    customerId: string;
    status: "INTERESTED" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    createdAt: string;
    updatedAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
    completedAt: string | null;
    customer: {
      id: number;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      address: string | null;
      city: string | null;
      distric: string | null;
      province: string | null;
      country: string | null;
      contactNo: string | null;
      image: string | null;
      createdAt: string;
      weddingEventId: string | null;
    };
  }>;
  packages: Array<{
    id: number;
    packageName: string;
    price: number;
    features: string;
    serviceId: string;
  }>;
  photos: Array<{
    id: number;
    imageUrl: string;
    serviceId: string;
  }>;
}

export default function BookedServicesPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getVendorId = useCallback(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("vendor") || "{}";
      const parsed = JSON.parse(raw);
      return parsed?.userId || parsed?.id || parsed?.vendorId || parsed?._id || null;
    } catch {
      return localStorage.getItem("vendorId") || null;
    }
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token") || "", []);

  const mapStatus = (s?: string) => {
    if (!s) return "pending";
    switch (s.toUpperCase()) {
      case "PENDING":
        return "pending";
      case "CONFIRMED":
        return "confirmed";
      case "CANCELLED":
        return "cancelled";
      case "COMPLETED":
        return "completed";
      default:
        return "pending";
    }
  };

  const transformBookings = useCallback((servicesData: ServiceWithBookings[]): BookingRequest[] => {
    const out: BookingRequest[] = [];
    servicesData.forEach((svc) => {
      svc.bookings.forEach((b) => {
        if (String(b.status).toUpperCase() === "INTERESTED") return;

        const customerLocation = [
          b.customer?.address,
          b.customer?.city,
          b.customer?.distric,
          b.customer?.province,
          b.customer?.country
        ].filter(Boolean).join(", ") || "Not provided";

        out.push({
          id: b.id,
          serviceId: svc.serviceId,
          customerName: `${b.customer?.firstName || ""} ${b.customer?.lastName || ""}`.trim() || "Customer",
          customerEmail: b.customer?.email || "Not provided",
          customerPhone: b.customer?.contactNo || "Not provided",
          customerAddress: customerLocation,
          serviceName: svc.serviceName,
          serviceType: svc.category,
          status: mapStatus(b.status) as BookingRequest["status"],
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          confirmedAt: b.confirmedAt,
          cancelledAt: b.cancelledAt,
          completedAt: b.completedAt,
        });
      });
    });
    return out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const vendorId = getVendorId();
      const token = getToken();

      if (!vendorId) {
        toast.error("Vendor ID not found");
        setBookings([]);
        setFilteredBookings([]);
        setLoading(false);
        return;
      }

      const resp = await fetch(`${BASE_URL}/booking/vendor/${vendorId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch bookings: ${resp.status}`);
      }

      const json = await resp.json();
      const servicesData: ServiceWithBookings[] = Array.isArray(json.data) ? json.data : [];
      const transformed = transformBookings(servicesData);
      setBookings(transformed);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      toast.error("Failed to load booking requests");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [getVendorId, getToken, transformBookings]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    let filtered = bookings;
    // Filter out confirmed bookings
    filtered = filtered.filter((b) => b.status !== "confirmed");

    if (selectedStatus !== "all") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          (b.customerName || "").toLowerCase().includes(q) ||
          (b.serviceName || "").toLowerCase().includes(q) ||
          (b.serviceType || "").toLowerCase().includes(q)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, selectedStatus, searchTerm]);

  const handleStatusUpdate = async (bookingId: string, newStatus: "confirmed" | "cancelled" | "completed") => {
    try {
      const token = getToken();
      const backendStatusMap: Record<string, string> = {
        confirmed: "CONFIRMED",
        cancelled: "CANCELLED",
        completed: "COMPLETED",
      };
      const backendStatus = backendStatusMap[newStatus];

      const resp = await fetch(`${BASE_URL}/booking/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookingId, status: backendStatus }),
      });

      if (!resp.ok) {
        throw new Error(`Update failed: ${resp.status}`);
      }

      const result = await resp.json();
      if (!result || !result.success) {
        throw new Error(result?.message || "Update failed");
      }

      await fetchServices();
      const statusMessages: Record<string, string> = {
        confirmed: "accepted",
        cancelled: "rejected",
        completed: "marked as completed",
      };
      toast.success(`Booking ${statusMessages[newStatus]} successfully`);
    } catch (err) {
      console.error("Error updating status", err);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-gradient-to-r from-yellow-100 to-amber-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
          dot: "bg-yellow-500"
        };
      case "confirmed":
        return {
          bg: "bg-gradient-to-r from-green-100 to-emerald-100",
          text: "text-green-700",
          border: "border-green-200",
          dot: "bg-green-500"
        };
      case "completed":
        return {
          bg: "bg-gradient-to-r from-purple-100 to-violet-100",
          text: "text-purple-700",
          border: "border-purple-200",
          dot: "bg-purple-500"
        };
      case "cancelled":
        return {
          bg: "bg-gradient-to-r from-red-100 to-rose-100",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500"
        };
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-full mr-24">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="text-center">
              <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-gray-600">Loading booking requests...</div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-full mr-24 mb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
              Booking Requests
            </h1>
          </div>
          <p className="text-gray-600">Manage your service bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-5 border-2 border-blue-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-600 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-5 border-2 border-yellow-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-5 border-2 border-green-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-green-900">{stats.confirmed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-5 border-2 border-purple-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 mb-1">Completed</p>
                <p className="text-3xl font-bold text-purple-900">{stats.completed}</p>
              </div>
              <Sparkles className="w-10 h-10 text-purple-600 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-5 border-2 border-red-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">Cancelled</p>
                <p className="text-3xl font-bold text-red-900">{stats.cancelled}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name, service, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["all", "pending", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedStatus === status
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-5">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-12 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No booking requests found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "You don't have any booking requests yet"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const statusStyles = getStatusStyles(booking.status);
              const statusLabel = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

              return (
                <div
                  key={booking.id}
                  className="bg-white border-2 border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6"
                >
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                    <div className="flex-1">
                      <div className="mb-3">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{booking.serviceName}</h3>
                          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {booking.serviceType}
                          </span>
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 ${statusStyles.border} ${statusStyles.bg} ${statusStyles.text}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${statusStyles.dot} animate-pulse`}></span>
                            {statusLabel}
                          </span>
                        </div>
                        {/* Service ID Badge */}
                        <div className="ml-1">
                          <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-300 inline-block">
                            Service ID: {booking.serviceId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Only for Pending */}
                    {booking.status === "pending" && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Customer Information - Single Card */}
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-lg border-2 border-purple-100 p-5 mb-4">
                    <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaMapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-0.5">Name</p>
                          <p className="font-bold text-gray-900">{booking.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-0.5">Phone</p>
                          <p className="font-bold text-gray-900">{booking.customerPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-0.5">Email</p>
                          <p className="font-bold text-gray-900 break-all">{booking.customerEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-0.5">Address</p>
                          <p className="font-bold text-gray-900">{booking.customerAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border-2 border-gray-200 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Booking Date</p>
                          <p className="text-sm font-bold text-gray-900">{formatDate(booking.updatedAt || booking.createdAt)}</p>
                        </div>
                      </div>

                      {booking.status === "confirmed" && booking.confirmedAt && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Confirmed Date</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(booking.confirmedAt)}</p>
                          </div>
                        </div>
                      )}

                      {booking.status === "cancelled" && booking.cancelledAt && (
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Cancelled Date</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(booking.cancelledAt)}</p>
                          </div>
                        </div>
                      )}

                      {booking.status === "completed" && booking.completedAt && (
                        <div className="flex items-center gap-3">
                          <CheckCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-600 font-semibold">Completed Date</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(booking.completedAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout >
  );
}