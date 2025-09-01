"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import DefaultButton from "@/components/DefaultButton";
import {
    Calendar,
    User,
    MapPin,
    Phone,
    Mail,
    Clock,
    DollarSign,
    Eye,
    X,
    Filter,
    Search,
    CheckCircle,
    Users
} from "lucide-react";

interface BookedService {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    serviceName: string;
    serviceType: string;
    bookingDate: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    totalAmount: number;
    specialRequests?: string;
    guestCount?: number;
    acceptedAt: string;
}

export default function BookedServicesPage() {
    const [bookedServices, setBookedServices] = useState<BookedService[]>([]);
    const [filteredServices, setFilteredServices] = useState<BookedService[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterByMonth, setFilterByMonth] = useState<string>("all");
    const [selectedService, setSelectedService] = useState<BookedService | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Mock data for accepted bookings - Replace with actual API call
    useEffect(() => {
        const mockBookedServices: BookedService[] = [
            {
                id: "2",
                customerName: "Michael Chen",
                customerEmail: "m.chen@email.com",
                customerPhone: "+1 (555) 987-6543",
                customerAddress: "456 Pine Avenue, Chicago, IL 60601",
                serviceName: "Elegant Floral Arrangements",
                serviceType: "Floristry",
                bookingDate: "2024-08-24",
                eventDate: "2024-11-30",
                eventTime: "16:00",
                eventLocation: "Riverside Garden Venue",
                totalAmount: 1800,
                specialRequests: "White and blush pink color scheme, seasonal flowers preferred",
                guestCount: 100,
                acceptedAt: "2024-08-24T15:30:00Z"
            },
            {
                id: "4",
                customerName: "David Wilson",
                customerEmail: "david.wilson@email.com",
                customerPhone: "+1 (555) 321-9876",
                customerAddress: "321 Cedar Lane, Seattle, WA 98101",
                serviceName: "Premium Wedding Photography",
                serviceType: "Photography",
                bookingDate: "2024-08-26",
                eventDate: "2024-12-20",
                eventTime: "15:00",
                eventLocation: "Oceanview Resort & Spa",
                totalAmount: 3200,
                specialRequests: "Sunset photos, beach ceremony coverage, reception documentation",
                guestCount: 120,
                acceptedAt: "2024-08-26T11:45:00Z"
            },
            {
                id: "5",
                customerName: "Lisa Rodriguez",
                customerEmail: "lisa.rodriguez@email.com",
                customerPhone: "+1 (555) 654-3210",
                customerAddress: "789 Elm Street, Miami, FL 33101",
                serviceName: "Live Wedding Band",
                serviceType: "Entertainment",
                bookingDate: "2024-08-27",
                eventDate: "2024-10-15",
                eventTime: "18:30",
                eventLocation: "The Grand Ballroom",
                totalAmount: 2800,
                specialRequests: "Jazz and classical music for ceremony, dance music for reception",
                guestCount: 180,
                acceptedAt: "2024-08-27T14:20:00Z"
            }
        ];

        setBookedServices(mockBookedServices);
        setFilteredServices(mockBookedServices);
    }, []);

    // Filter services based on search term and month
    useEffect(() => {
        let filtered = bookedServices;

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterByMonth !== "all") {
            filtered = filtered.filter(service => {
                const eventMonth = new Date(service.eventDate).getMonth();
                return eventMonth === parseInt(filterByMonth);
            });
        }

        setFilteredServices(filtered);
    }, [bookedServices, searchTerm, filterByMonth]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getMonthName = (monthIndex: number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[monthIndex];
    };

    const totalRevenue = bookedServices.reduce((sum, service) => sum + service.totalAmount, 0);
    const upcomingEvents = bookedServices.filter(service => new Date(service.eventDate) > new Date()).length;

    return (
        <MainLayout>
            <div className="max-w-full mr-24">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
                        Booked Services
                    </h1>
                    <p className="text-gray-600">Manage your confirmed wedding service bookings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md border border-purple-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                <p className="text-xl font-bold text-purple-800">{bookedServices.length}</p>
                            </div>
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-purple-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                                <p className="text-xl font-bold text-blue-600">{upcomingEvents}</p>
                            </div>
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-purple-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                            </div>
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md border border-purple-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                                <p className="text-xl font-bold text-orange-600">
                                    {bookedServices.reduce((sum, service) => sum + (service.guestCount || 0), 0)}
                                </p>
                            </div>
                            <Users className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-md border border-purple-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by customer name, service, or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                                />
                            </div>
                        </div>

                        {/* Month Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterByMonth}
                                onChange={(e) => setFilterByMonth(e.target.value)}
                                className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                            >
                                <option value="all">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i.toString()}>
                                        {getMonthName(i)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Booked Services List */}
                <div className="space-y-4">
                    {filteredServices.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md border border-purple-100 p-8 text-center">
                            <CheckCircle className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                            <h3 className="text-md font-medium text-gray-900 mb-2">No booked services found</h3>
                            <p className="text-gray-600 text-sm">
                                {searchTerm || filterByMonth !== "all"
                                    ? "Try adjusting your filters or search terms"
                                    : "You haven't confirmed any bookings yet"}
                            </p>
                        </div>
                    ) : (
                        filteredServices.map((service) => (
                            <div key={service.id} className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-4">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Main Info */}
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                <h3 className="text-md font-semibold text-gray-900">{service.serviceName}</h3>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Confirmed
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <User className="w-4 h-4 text-purple-600" />
                                                    <span className="font-medium">{service.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Calendar className="w-4 h-4 text-purple-600" />
                                                    <span>{formatDate(service.eventDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="font-medium text-green-600">${service.totalAmount}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <MapPin className="w-4 h-4 text-purple-600" />
                                                <span>{service.eventLocation}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <DefaultButton
                                                btnLabel="View Details"
                                                handleClick={() => {
                                                    setSelectedService(service);
                                                    setShowDetails(true);
                                                }}
                                                Icon={<Eye className="w-4 h-4" />}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-[140px] text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Service Details Modal */}
                {showDetails && selectedService && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-4 border-b border-purple-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                                            {selectedService.serviceName}
                                        </h2>
                                        <p className="text-gray-600 text-sm">{selectedService.serviceType}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Customer Information */}
                                <div>
                                    <h3 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <User className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Name</p>
                                                <p className="font-semibold text-sm">{selectedService.customerName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <Mail className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Email</p>
                                                <p className="font-semibold text-sm">{selectedService.customerEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <Phone className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Phone</p>
                                                <p className="font-semibold text-sm">{selectedService.customerPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <MapPin className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Address</p>
                                                <p className="font-semibold text-sm">{selectedService.customerAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div>
                                    <h3 className="text-md font-semibold text-gray-900 mb-3">Event Details</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <Calendar className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Event Date</p>
                                                <p className="font-semibold text-sm">{formatDate(selectedService.eventDate)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <Clock className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Event Time</p>
                                                <p className="font-semibold text-sm">{formatTime(selectedService.eventTime)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <MapPin className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Venue</p>
                                                <p className="font-semibold text-sm">{selectedService.eventLocation}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <Users className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Guest Count</p>
                                                <p className="font-semibold text-sm">{selectedService.guestCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div>
                                    <h3 className="text-md font-semibold text-gray-900 mb-3">Booking Details</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <DollarSign className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Total Amount</p>
                                                <p className="font-bold text-lg text-purple-800">${selectedService.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <CheckCircle className="w-4 h-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-purple-700 font-medium">Booking Status</p>
                                                <p className="font-semibold text-sm text-green-600">Confirmed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Requests */}
                                {selectedService.specialRequests && (
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-900 mb-3">Special Requests</h3>
                                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <p className="text-gray-800 text-sm">{selectedService.specialRequests}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}