/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { JSX, useEffect, useState } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaUsers, FaStore, FaClipboardList, FaStar, FaCalendarAlt, FaHeart, FaTrophy } from "react-icons/fa";
import { Loader } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import toast from "react-hot-toast";

type Metrics = {
    customers: number;
    vendors: number;
    services: number;
    bookings: number;
    events: number;
};

type ServiceBooking = {
    service: string;
    vendor: string;
    category: string;
    bookings: number;
};

type TopRatedService = {
    service: string;
    vendor: string;
    category: string;
    rating: number;
    reviews: number;
};

type MonthlyRegistrations = {
    month: string;
    vendors: number;
    customers: number;
};

type ServiceCategory = {
    category: string;
    totalServices: number;
};

const COLORS = ["#7c3aed", "#4338ca", "#be185d", "#f59e42", "#10b981", "#6366f1"];

// Section 1: Metrics Cards Component
function MetricsCardsSection({ metrics, loading }: { metrics: Metrics | null; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-100 text-sm">Customers</p>
                        <p className="text-2xl font-bold">{loading ? "—" : metrics?.customers}</p>
                    </div>
                    <FaUsers className="text-3xl text-purple-200" />
                </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">Vendors</p>
                        <p className="text-2xl font-bold">{loading ? "—" : metrics?.vendors}</p>
                    </div>
                    <FaStore className="text-3xl text-blue-200" />
                </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 text-sm">Services</p>
                        <p className="text-2xl font-bold">{loading ? "—" : metrics?.services}</p>
                    </div>
                    <FaClipboardList className="text-3xl text-green-200" />
                </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-orange-100 text-sm">Bookings</p>
                        <p className="text-2xl font-bold">{loading ? "—" : metrics?.bookings}</p>
                    </div>
                    <FaHeart className="text-3xl text-orange-200" />
                </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-pink-100 text-sm">Events</p>
                        <p className="text-2xl font-bold">{loading ? "—" : metrics?.events}</p>
                    </div>
                    <FaCalendarAlt className="text-3xl text-pink-200" />
                </div>
            </div>
        </div>
    );
}

// Section 2: New Registrations Component
function NewRegistrationsSection({ data, loading }: { data: MonthlyRegistrations[]; loading: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                    <FaUsers className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">New Registrations</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <Loader className="animate-spin w-6 h-6 text-purple-600 mx-auto" /> 
                </div>
            ) : data.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No registration data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="vendors" fill="#7c3aed" name="Vendors" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="customers" fill="#10b981" name="Customers" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

// Section 3: Most Booked Services Component
function MostBookedServicesSection({ services, loading }: { services: ServiceBooking[]; loading: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <FaHeart className="text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Most Booked Services</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                    <Loader className="animate-spin w-6 h-6 text-purple-600 mx-auto" /> 
                </div>
            ) : (
                <div className="space-y-4">
                    {services.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No booking data available</p>
                    ) : (
                        services.map((service, index) => (
                            <div key={service.service} className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{service.service}</h4>
                                            <p className="text-sm text-gray-600">{service.vendor}</p>
                                            <p className="text-xs text-orange-600 font-medium">{service.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-orange-600">{service.bookings}</div>
                                        <div className="text-xs text-gray-500">bookings</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Section 4: Top Rated Services Component
function TopRatedServicesSection({ services, loading }: { services: TopRatedService[]; loading: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                    <FaTrophy className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Top Rated Services</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-[200px]">
                    <Loader className="animate-spin w-6 h-6 text-purple-600 mx-auto" /> 
                </div>
            ) : (
                <div className="space-y-4">
                    {services.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No rating data available</p>
                    ) : (
                        services.map((service, index) => (
                            <div key={service.service} className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{service.service}</h4>
                                            <p className="text-sm text-gray-600">{service.vendor}</p>
                                            <p className="text-xs text-yellow-600 font-medium">{service.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <FaStar className="text-yellow-500" />
                                            <span className="text-xl font-bold text-yellow-600">{service.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{service.reviews} reviews</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Section 5: Service Distribution Component
function ServiceDistributionSection({ data, loading }: { data: { category: string; value: number }[]; loading: boolean }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <FaClipboardList className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Service Distribution</h3>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <Loader className="animate-spin w-6 h-6 text-purple-600 mx-auto" /> 
                </div>
            ) : data.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No service data available</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ category, value }) => `${category}: ${value}`}
                        >
                            {data.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default function DashboardOverviewPage(): JSX.Element {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [topBookedServices, setTopBookedServices] = useState<ServiceBooking[]>([]);
    const [topRatedServices, setTopRatedServices] = useState<TopRatedService[]>([]);
    const [categoryData, setCategoryData] = useState<{ category: string; value: number }[]>([]);
    const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyRegistrations[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRegistrations, setLoadingRegistrations] = useState(true);
    const [loadingServiceCounts, setLoadingServiceCounts] = useState(true);
    const [loadingTopBooked, setLoadingTopBooked] = useState(true);
    const [loadingTopRated, setLoadingTopRated] = useState(true);
    const [mounted, setMounted] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        setMounted(true);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        if (!BASE_URL) {
            toast.error("Backend URL not configured");
            setLoading(false);
            setLoadingRegistrations(false);
            setLoadingServiceCounts(false);
            setLoadingTopBooked(false);
            setLoadingTopRated(false);
            return;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            toast.error("Not authenticated");
            setLoading(false);
            setLoadingRegistrations(false);
            setLoadingServiceCounts(false);
            setLoadingTopBooked(false);
            setLoadingTopRated(false);
            return;
        }

        let token: string | undefined;
        try {
            const parsed = JSON.parse(raw);
            token = parsed?.token;
        } catch {
            toast.error("Invalid session");
            setLoading(false);
            setLoadingRegistrations(false);
            setLoadingServiceCounts(false);
            setLoadingTopBooked(false);
            setLoadingTopRated(false);
            return;
        }

        if (!token) {
            toast.error("Authentication token missing");
            setLoading(false);
            setLoadingRegistrations(false);
            setLoadingServiceCounts(false);
            setLoadingTopBooked(false);
            setLoadingTopRated(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch dashboard summary counts
            const countsResponse = await fetch(`${BASE_URL}/admin/summary/counts`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!countsResponse.ok) {
                throw new Error("Failed to fetch dashboard counts");
            }

            const countsData = await countsResponse.json();
            
            if (countsData.success && countsData.data) {
                setMetrics({
                    customers: countsData.data.totalCustomers || 0,
                    vendors: countsData.data.totalVendors || 0,
                    services: countsData.data.totalServices || 0,
                    bookings: countsData.data.totalBookings || 0,
                    events: countsData.data.totalEvents || 0,
                });
            }

            // Fetch monthly registrations
            setLoadingRegistrations(true);
            const registrationsResponse = await fetch(`${BASE_URL}/admin/monthly-registrations`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (registrationsResponse.ok) {
                const registrationsData = await registrationsResponse.json();
                
                if (registrationsData.success && registrationsData.data) {
                    setMonthlyRegistrations(registrationsData.data);
                }
            } else {
                console.error("Failed to fetch monthly registrations");
            }
            setLoadingRegistrations(false);

            // Fetch service counts by category
            setLoadingServiceCounts(true);
            const serviceCountsResponse = await fetch(`${BASE_URL}/admin/service-counts`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (serviceCountsResponse.ok) {
                const serviceCountsData = await serviceCountsResponse.json();
                
                if (serviceCountsData.success && serviceCountsData.data) {
                    // Transform the data to match the pie chart format
                    const transformedData = serviceCountsData.data.map((item: ServiceCategory) => ({
                        category: item.category,
                        value: item.totalServices,
                    }));
                    setCategoryData(transformedData);
                }
            } else {
                console.error("Failed to fetch service counts");
            }
            setLoadingServiceCounts(false);

            // Fetch top booked services
            setLoadingTopBooked(true);
            const topBookedResponse = await fetch(`${BASE_URL}/admin/top-booked-services`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (topBookedResponse.ok) {
                const topBookedData = await topBookedResponse.json();
                
                if (topBookedData.success && topBookedData.data) {
                    const transformedBookedServices = topBookedData.data.map((item: any) => ({
                        service: item.serviceName,
                        vendor: item.vendorName,
                        category: item.category,
                        bookings: item.bookingCount,
                    }));
                    setTopBookedServices(transformedBookedServices);
                }
            } else {
                console.error("Failed to fetch top booked services");
            }
            setLoadingTopBooked(false);

            // Fetch top rated services
            setLoadingTopRated(true);
            const topRatedResponse = await fetch(`${BASE_URL}/admin/top-rated-services`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (topRatedResponse.ok) {
                const topRatedData = await topRatedResponse.json();
                
                if (topRatedData.success && topRatedData.data) {
                    const transformedRatedServices = topRatedData.data.map((item: any) => ({
                        service: item.serviceName,
                        vendor: item.vendorName,
                        category: item.category,
                        rating: item.averageRating,
                        reviews: item.reviewCount,
                    }));
                    setTopRatedServices(transformedRatedServices);
                }
            } else {
                console.error("Failed to fetch top rated services");
            }
            setLoadingTopRated(false);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) {
        return (
            <AdminMainLayout>
                <div className="max-w-6xl mr-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">Dashboard Overview</h1>
                            <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
                        </div>
                        <div className="bg-purple-50 px-4 py-2 rounded-lg">
                            <div className="text-sm text-purple-700 font-medium">Last updated</div>
                            <div className="text-xs text-purple-600">Loading...</div>
                        </div>
                    </div>
                </div>
            </AdminMainLayout>
        );
    }

    return (
        <AdminMainLayout>
            <div className="max-w-6xl mr-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">Dashboard Overview</h1>
                        <p className="text-gray-600 mt-2">Comprehensive analytics and insights</p>
                    </div>
                    <div className="bg-purple-50 px-4 py-2 rounded-lg">
                        <div className="text-sm text-purple-700 font-medium">Last updated</div>
                        <div className="text-xs text-purple-600">{new Date().toLocaleString()}</div>
                    </div>
                </div>

                {/* Section 1: Metrics Cards */}
                <MetricsCardsSection metrics={metrics} loading={loading} />

                {/* Section 2 & 5: New Registrations and Service Distribution */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <NewRegistrationsSection data={monthlyRegistrations} loading={loadingRegistrations} />
                    <ServiceDistributionSection data={categoryData} loading={loadingServiceCounts} />
                </div>

                {/* Section 3 & 4: Most Booked and Top Rated Services */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <MostBookedServicesSection services={topBookedServices} loading={loadingTopBooked} />
                    <TopRatedServicesSection services={topRatedServices} loading={loadingTopRated} />
                </div>
            </div>
        </AdminMainLayout>
    );
}