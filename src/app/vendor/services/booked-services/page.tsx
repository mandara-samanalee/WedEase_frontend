"use client";
import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { Calendar, User, MapPin, Phone, Mail, Loader, CheckCircle, Clock, CheckCheck } from "lucide-react";
import { FaMapPin } from "react-icons/fa6";
import toast from "react-hot-toast";

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
        confirmedAt?: string | null;
        customer: {
            firstName: string;
            lastName: string;
            email: string;
            contactNo?: string | null;
            address?: string | null;
            city?: string | null;
            distric?: string | null;
            province?: string | null;
            country?: string | null;
        };
    }>;
}

type AcceptedEntry = {
    bookingId: string;
    serviceId: string;
    serviceName: string;
    serviceCategory: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string | null;
    customerAddress?: string;
    bookingCreatedAt: string;
    confirmedAt?: string | null;
};

export default function BookedServicesPage() {
    const [accepted, setAccepted] = useState<AcceptedEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getVendorId = useCallback(() => {
        try {
            const raw = localStorage.getItem("user") || localStorage.getItem("vendor") || "{}";
            const parsed = JSON.parse(raw);
            return parsed?.userId || parsed?.id || parsed?.vendorId || null;
        } catch {
            return localStorage.getItem("vendorId") || null;
        }
    }, []);

    const getToken = useCallback(() => localStorage.getItem("token") || "", []);

    const fetchVendorBookings = useCallback(async () => {
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
                    const customerLocation = [
                        b.customer?.address,
                        b.customer?.city,
                        b.customer?.distric,
                        b.customer?.province,
                        b.customer?.country
                    ].filter(Boolean).join(", ") || "Not provided";

                    acceptedList.push({
                        bookingId: b.id,
                        serviceId: svc.serviceId,
                        serviceName: svc.serviceName,
                        serviceCategory: svc.category,
                        customerName: `${b.customer?.firstName || ""} ${b.customer?.lastName || ""}`.trim() || "Customer",
                        customerEmail: b.customer?.email,
                        customerPhone: b.customer?.contactNo ?? null,
                        customerAddress: customerLocation,
                        bookingCreatedAt: b.createdAt,
                        confirmedAt: b.confirmedAt,
                    });
                });
            });

            // Sort by confirmed date (most recent first)
            acceptedList.sort((a, b) => {
                const dateA = a.confirmedAt ? new Date(a.confirmedAt).getTime() : new Date(a.bookingCreatedAt).getTime();
                const dateB = b.confirmedAt ? new Date(b.confirmedAt).getTime() : new Date(b.bookingCreatedAt).getTime();
                return dateB - dateA;
            });

            setAccepted(acceptedList);
        } catch (err) {
            console.error("Error fetching vendor bookings:", err);
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }, [getVendorId, getToken]);

    useEffect(() => {
        fetchVendorBookings();
    }, [fetchVendorBookings]);

    const handleMarkComplete = async (bookingId: string) => {
        try {
            const token = getToken();
            const resp = await fetch(`${BASE_URL}/booking/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ bookingId, status: "COMPLETED" }),
            });

            if (!resp.ok) {
                throw new Error(`Update failed: ${resp.status}`);
            }

            const result = await resp.json();
            if (!result || !result.success) {
                throw new Error(result?.message || "Update failed");
            }

            await fetchVendorBookings();
            toast.success("Booking marked as completed successfully");
        } catch (err) {
            console.error("Error updating status", err);
            toast.error("Failed to mark booking as completed");
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const getDaysAgo = (dateStr: string) => {
        const now = new Date();
        const past = new Date(dateStr);
        const diffTime = Math.abs(now.getTime() - past.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="max-w-full mr-24">
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading accepted bookings...</p>
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
                            Confirmed Bookings
                        </h1>
                    </div>
                    <p className="text-gray-600">Overview of all confirmed service bookings</p>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-lg border-2 border-green-200 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-green-700 mb-1">Total Confirmed Bookings</p>
                            <p className="text-4xl font-bold text-green-900">{accepted.length}</p>
                        </div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-md mb-6">
                        <p className="font-semibold mb-1">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Bookings List */}
                <div className="space-y-6">
                    {accepted.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-12 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accepted bookings yet</h3>
                            <p className="text-gray-600">You haven&apos;t confirmed any bookings yet. Check your booking requests to accept new bookings.</p>
                        </div>
                    ) : accepted.map((booking) => {
                        return (
                            <div
                                key={booking.bookingId}
                                className="bg-white border-2 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 relative overflow-hidden"
                            >
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-30"></div>

                                {/* Header Section */}
                                <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-bold text-gray-900">{booking.serviceName}</h3>
                                            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                {booking.serviceCategory}
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                                Confirmed
                                            </span>
                                        </div>

                                        {/* Service ID Badge */}
                                        <div className="ml-1 mb-3">
                                            <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-300 inline-block">
                                                Service ID: {booking.serviceId}
                                            </span>
                                        </div>

                                        {/* Days Ago Badge */}
                                        {booking.confirmedAt && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                <span className="font-semibold text-purple-600">
                                                    Accepted {getDaysAgo(booking.confirmedAt)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap">
                                        <button
                                            onClick={() => handleMarkComplete(booking.bookingId)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-semibold"
                                        >
                                            <CheckCheck className="w-5 h-5" />
                                            Mark Complete
                                        </button>
                                    </div>
                                </div>

                                {/* Customer Details */}
                                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 p-5 mb-5">
                                    <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaMapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        Customer Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-start gap-3">
                                            <User className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold mb-0.5">Name</p>
                                                <p className="font-bold text-gray-900">{booking.customerName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold mb-0.5">Phone</p>
                                                <p className="font-bold text-gray-900">{booking.customerPhone || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold mb-0.5">Email</p>
                                                <p className="font-bold text-gray-900 break-all">{booking.customerEmail || "Not provided"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold mb-0.5">Address</p>
                                                <p className="font-bold text-gray-900">{booking.customerAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Information */}
                                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border-2 border-gray-200 p-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold">Booking Date</p>
                                                <p className="text-sm font-bold text-gray-900">{formatDate(booking.bookingCreatedAt)}</p>
                                            </div>
                                        </div>

                                        {booking.confirmedAt && (
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-600 font-semibold">Confirmed Date</p>
                                                    <p className="text-sm font-bold text-gray-900">{formatDate(booking.confirmedAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Decorative Bottom Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}