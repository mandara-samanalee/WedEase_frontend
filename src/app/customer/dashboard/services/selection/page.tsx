"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import Link from "next/link";
import { Trash2, CheckCircle2, Clock4, ArrowLeft, MapPin, Phone, Calendar, Mail, Globe, Loader } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type BookingStatus = "interested" | "pending" | "confirmed" | "declined";

type Booking = {
  id: string;
  name: string;
  provider: string;
  category: string;
  price?: number;
  status: BookingStatus;
  addedAt: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  location?: string;
  serviceId?: string;
  customerId?: string;
  bookingDate?: string;
};

export default function ServicesSelectionPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      case "COMPLETED":
        return "confirmed";
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
        const price =
          svc.packages && Array.isArray(svc.packages) && svc.packages.length > 0
            ? svc.packages[0].price
            : undefined;

        return {
          id: b.id,
          name: svc.serviceName || b.serviceName || "Unnamed Service",
          provider: `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || vendor.providerName || "Unknown Provider",
          category: svc.category || b.category || "Other",
          price: typeof price === "number" ? price : undefined,
          status: mapApiStatusToLocalStatus(b.status),
          addedAt: b.createdAt || b.bookingDate || new Date().toISOString(),
          contactNumber: vendor.contactNo || b.contactNumber || undefined,
          email: vendor.email || b.email || undefined,
          website: b.website || undefined,
          location: svc.address || svc.city || b.location || "Not specified",
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

      // refresh
      await fetchBookings();
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status");
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
      // API may return success property
      if (json && json.success === false) {
        throw new Error(json.message || "Delete failed");
      }

      // refresh
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
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
    if (confirm("Are you sure you want to remove this booking?")) {
      await deleteBooking(id);
    }
  };


  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "confirmed":
        return { text: "Confirmed", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={12} /> };
      case "declined":
        return { text: "Declined", color: "bg-red-100 text-red-700", icon: <Trash2 size={12} /> };
      case "pending":
        return { text: "Pending", color: "bg-blue-100 text-blue-700", icon: <Clock4 size={12} /> };
      default:
        return { text: "Interested", color: "bg-amber-100 text-amber-700", icon: <Clock4 size={12} /> };
    }
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
              My Bookings
            </h1>
            <p className="text-sm text-gray-600">Manage your service bookings</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/customer/service/browse"
              className="inline-flex items-center text-sm px-3 py-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft size={14} className="mr-1" /> Browse More
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading bookings</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full flex flex-col items-center justify-center">
              <Loader className="animate-spin w-12 h-12 text-purple-600 mb-4" />
              <p className="text-gray-600">Loading your Bookings...</p>
            </div>
          )}

          {!loading && !error && !bookings.length && (
            <div className="col-span-full p-10 text-center">
              <div className="text-4xl mb-2">🗂️</div>
              <p className="text-gray-600 mb-4">No bookings found. Browse services and make your first booking!</p>
              <Link href="/customer/service/browse" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Browse Services
              </Link>
            </div>
          )}

          {bookings.map((booking) => {
            const statusInfo = getStatusDisplay(booking.status);
            const canChangeStatus = booking.status === "interested";

            return (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                    <p className="text-sm text-gray-600">{booking.provider} • {booking.category}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span>Booked: {new Date(booking.addedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full text-[13px] font-medium px-2 py-1 ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>
                    {booking.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        <span>{booking.contactNumber}</span>
                      </div>
                    )}
                    {booking.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        <span>{booking.email}</span>
                      </div>
                    )}
                    {booking.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-500" />
                        <a href={booking.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-500" />
                      <span>{booking.location}</span>
                    </div>
                    {booking.price !== undefined && (
                      <div className="text-purple-600 font-medium">LKR {booking.price.toLocaleString()}</div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/customer/service/${encodeURIComponent(booking.serviceId ?? "")}`}
                      className="flex-1 text-center px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                    >
                      View Details
                    </Link>
                    {canChangeStatus && (
                      <button onClick={() => toggleStatus(booking.id)} className="px-3 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-sm">
                        Book Now
                      </button>
                    )}
                    <button onClick={() => removeItem(booking.id)} className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomerMainLayout>
  );
}