"use client";

import React, { JSX, useEffect, useState } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaUsers, FaStore, FaClipboardList, FaStar, FaCalendarAlt, FaHeart, FaTrophy } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

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

const COLORS = ["#7c3aed", "#4338ca", "#be185d", "#f59e42", "#10b981", "#6366f1"];

export default function DashboardOverviewPage(): JSX.Element {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [topBookedServices, setTopBookedServices] = useState<ServiceBooking[]>([]);
    const [topRatedServices, setTopRatedServices] = useState<TopRatedService[]>([]);
    const [categoryData, setCategoryData] = useState<{ category: string; value: number }[]>([]);
    const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyRegistrations[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setLoading(true);
        const timer = setTimeout(() => {
            // Mock data with numbers 1-25
            setMetrics({
                customers: 11,
                vendors: 8,
                services: 18,
                bookings: 6,
                events: 3,
            });

            const mockTopBookedServices: ServiceBooking[] = [
                { service: "Wedding Photography Premium", vendor: "John's Photography", category: "Photography", bookings: 5 },
                { service: "Full Wedding Planning", vendor: "Sarah's Event Planning", category: "Planning", bookings: 3 },
                { service: "Venue Decoration - Elite", vendor: "Elite Decorations", category: "Decoration", bookings: 2 },
            ];

            const mockTopRatedServices: TopRatedService[] = [
                { service: "Full Wedding Planning", vendor: "Sarah's Event Planning", category: "Planning", rating: 4.9, reviews: 22 },
                { service: "Wedding Photography Premium", vendor: "John's Photography", category: "Photography", rating: 4.8, reviews: 18 },
                { service: "Bridal Makeup Deluxe", vendor: "Beauty Studio", category: "Beauty", rating: 4.7, reviews: 14 },
            ];

            setTopBookedServices(mockTopBookedServices);
            setTopRatedServices(mockTopRatedServices);

            // Aggregate bookings by category
            const categoryMap: Record<string, number> = {
                "Photography": 6,
                "Planning": 4,
                "Decoration": 3,
                "Catering": 2,
                "Beauty": 3,
            };
            setCategoryData(Object.entries(categoryMap).map(([category, value]) => ({ category, value })));

            setMonthlyRegistrations([
                { month: "Jun", vendors: 3, customers: 12 },
                { month: "Jul", vendors: 5, customers: 16 },
                { month: "Aug", vendors: 2, customers: 9 },
            ]);

            setLoading(false);
        }, 450);
        return () => clearTimeout(timer);
    }, []);

    // Don't render date until component is mounted to avoid hydration mismatch
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

                {/* Metrics cards */}
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

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Service Distribution Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FaClipboardList className="text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Service Distribution</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ category, value }) => `${category}: ${value}`}
                                >
                                    {categoryData.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* New Registrations Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaUsers className="text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">New Registrations</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyRegistrations}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="vendors" fill="#7c3aed" name="Vendors" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="customers" fill="#10b981" name="Customers" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Services Cards Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Most Booked Services */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FaHeart className="text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Most Booked Services</h3>
                        </div>
                        <div className="space-y-4">
                            {topBookedServices.map((service, index) => (
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
                            ))}
                        </div>
                    </div>

                    {/* Top Rated Services */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FaTrophy className="text-yellow-600" />
                            </div>
                            <h3 className="text-lg  font-semibold text-gray-900">Top Rated Services</h3>
                        </div>
                        <div className="space-y-4">
                            {topRatedServices.map((service, index) => (
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
                                                <span className="text-xl font-bold text-yellow-600">{service.rating}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">{service.reviews} reviews</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminMainLayout>
    );
}