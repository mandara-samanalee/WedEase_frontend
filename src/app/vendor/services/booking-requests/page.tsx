"use client";
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { BookingRequest } from "@/components/BookingRequests/Types";
import StatsCards from "@/components/BookingRequests/StatsCards";
import FiltersBar from "@/components/BookingRequests/FiltersBar";
import BookingCard from "@/components/BookingRequests/BookingCards";
import BookingDetailsModal from "@/components/BookingRequests/BookingDetailModal";
import { Loader } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Interface to match your API response
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
  bookings: Array<{
    id: string;
    serviceId: string;
    customerId: string;
    status: "INTERESTED" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    createdAt: string;
    updatedAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
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
  const [, setServices] = useState<ServiceWithBookings[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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

  // map API status to frontend status strings
  const mapStatus = (s?: string) => {
    if (!s) return "interested";
    switch (s.toUpperCase()) {
      case "PENDING":
        return "pending";
      case "CONFIRMED":
        return "accepted";
      case "CANCELLED":
      case "REJECTED":
        return "declined";
      case "COMPLETED":
        return "completed";
      case "INTERESTED":
      default:
        return "interested";
    }
  };

  // Transform API data to BookingRequest array (include all statuses)
  const transformBookings = useCallback((servicesData: ServiceWithBookings[]): BookingRequest[] => {
    const out: BookingRequest[] = [];
    servicesData.forEach((svc) => {
      const basePrice = svc.packages && svc.packages.length ? svc.packages[0].price : 0;
      svc.bookings.forEach((b) => {
        out.push({
          id: b.id,
          customerName: `${b.customer?.firstName || ""} ${b.customer?.lastName || ""}`.trim() || "Customer",
          customerEmail: b.customer?.email || undefined,
          customerPhone: b.customer?.contactNo || undefined,
          customerAddress: b.customer?.address || undefined,
          serviceName: svc.serviceName,
          serviceType: svc.category,
          bookingDate: b.createdAt,
          eventDate: b.createdAt,
          eventTime: "00:00",
          eventLocation: svc.address || "Not specified",
          totalAmount: basePrice,
          status: mapStatus(b.status) as BookingRequest["status"],
          specialRequests: "",
          guestCount: svc.capacity ? parseInt(svc.capacity) : 0,
          createdAt: b.createdAt,
        } as BookingRequest);
      });
    });
    return out;
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const vendorId = getVendorId();
      const token = getToken();
      if (!vendorId) {
        setError("Vendor ID not found");
        setServices([]);
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
        const txt = await resp.text().catch(() => "");
        throw new Error(`Failed to fetch vendor bookings: ${resp.status} ${txt}`);
      }

      const json = await resp.json();
      const servicesData: ServiceWithBookings[] = Array.isArray(json.data) ? json.data : [];
      setServices(servicesData);
      const transformed = transformBookings(servicesData);
      setBookings(transformed);
    } catch (err) {
      console.error("Failed to fetch services", err);
      setError("Failed to load booking requests");
      setServices([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [getVendorId, getToken, transformBookings]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Filter logic
  useEffect(() => {
    let filtered = bookings;
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

  const handleStatusUpdate = async (bookingId: string, newStatus: "accepted" | "declined") => {
    try {
      const token = getToken();
      const backendStatusMap: Record<string, string> = {
        accepted: "CONFIRMED",
        declined: "CANCELLED",
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
        const text = await resp.text().catch(() => "");
        throw new Error(`Update failed: ${resp.status} ${text}`);
      }

      const result = await resp.json();
      if (!result || !result.success) {
        throw new Error(result?.message || "Update failed");
      }

      // refresh list after update
      await fetchServices();
      alert(`Booking ${newStatus} successfully`);
    } catch (err) {
      console.error("Error updating status", err);
      alert("Failed to update booking status. Please try again.");
    }
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
      <div className="max-w-full mr-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
            Booking Requests
          </h1>
          <p className="text-gray-600">Manage booking requests </p>
        </div>

        <StatsCards bookings={bookings} />

        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
              <div className="w-12 h-12 text-gray-300 mx-auto mb-3">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-md font-medium text-gray-900 mb-2">No booking requests found</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm || selectedStatus !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No booking requests at the moment"}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <BookingCard booking={booking} onView={(b) => { setSelectedBooking(b); setShowDetails(true); }} onUpdateStatus={handleStatusUpdate} />
              </div>
            ))
          )}
        </div>

        <BookingDetailsModal open={showDetails} booking={selectedBooking} onClose={() => setShowDetails(false)} />
      </div>
    </MainLayout>
  );
}