"use client";
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import DefaultButton from "@/components/DefaultButton";
import { Calendar, User, MapPin, DollarSign, Eye, CheckCircle } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ApiService {
  id: number;
  serviceId: string;
  serviceName: string;
  category: string;
  photos: { id: number; imageUrl: string }[];
  packages?: { id: number; packageName: string; price: number }[];
  bookings: Array<{
    id: string;
    serviceId: string;
    customerId: string;
    status: string;
    createdAt: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      contactNo?: string | null;
    };
  }>;
}

type AcceptedEntry = {
  bookingId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string | null;
  bookingCreatedAt: string;
  price?: number;
};

export default function BookedServicesPage() {
  const [accepted, setAccepted] = useState<AcceptedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getVendorId = useCallback(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("vendor") || "{}";
      const parsed = JSON.parse(raw);
      return parsed?.userId || parsed?.id || parsed?.vendorId || localStorage.getItem("vendorId") || null;
    } catch {
      return localStorage.getItem("vendorId") || null;
    }
  }, []);

  const getToken = useCallback(() => localStorage.getItem("token") || "", []);

  useEffect(() => {
    const fetchVendorBookings = async () => {
      setLoading(true);
      setError(null);

      const vendorId = getVendorId();
      const token = getToken();

      if (!vendorId) {
        setError("Vendor ID not found");
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch(`${BASE_URL}/booking/vendor/${vendorId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!resp.ok) {
          throw new Error(`Failed to fetch vendor bookings (${resp.status})`);
        }

        const json = await resp.json();
        const services: ApiService[] = Array.isArray(json.data) ? json.data : [];

        const acceptedList: AcceptedEntry[] = [];

        services.forEach((svc) => {
          const confirmedBookings = (svc.bookings || []).filter((b) => String(b.status).toUpperCase() === "CONFIRMED");
          confirmedBookings.forEach((b) => {
            acceptedList.push({
              bookingId: b.id,
              serviceId: svc.serviceId,
              serviceName: svc.serviceName,
              customerName: `${b.customer?.firstName || ""} ${b.customer?.lastName || ""}`.trim() || "Customer",
              customerEmail: b.customer?.email,
              customerPhone: b.customer?.contactNo ?? null,
              bookingCreatedAt: b.createdAt,
              price:
                svc.packages && svc.packages.length > 0
                  ? svc.packages.reduce((min, p) => Math.min(min, p.price), Number.POSITIVE_INFINITY)
                  : undefined,
            });
          });
        });

        setAccepted(acceptedList);
      } catch (err) {
        console.error("Error fetching vendor bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorBookings();
  }, [getVendorId, getToken]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-full mr-24">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading accepted bookings...</p>
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
            Accepted Bookings
          </h1>
          <p className="text-gray-600">Only bookings that were accepted are shown here.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {accepted.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md border border-purple-100 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-purple-300 mx-auto mb-3" />
              <h3 className="text-md font-medium text-gray-900 mb-2">No accepted bookings</h3>
              <p className="text-gray-600 text-sm">You have not confirmed any bookings yet.</p>
            </div>
          ) : (
            accepted.map((a) => (
              <div key={a.bookingId} className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-md font-semibold text-gray-900">{a.serviceName}</h3>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Confirmed
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{a.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>{formatDate(a.bookingCreatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-green-600">LKR {a.price ?? "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span>{a.customerPhone ?? a.customerEmail ?? "Contact not provided"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <DefaultButton
                        btnLabel="View Details"
                        handleClick={() => {
                          /* you can open modal or navigate to service page */
                          window.location.href = `/vendor/services/${encodeURIComponent(a.serviceId)}`;
                        }}
                        Icon={<Eye className="w-4 h-4" />}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition w-[160px] text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}