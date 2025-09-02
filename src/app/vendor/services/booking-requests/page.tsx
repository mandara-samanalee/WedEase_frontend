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
    Check,
    X,
    Eye,
    Filter,
    Search
} from "lucide-react";

interface BookingRequest {
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
    status: "pending" | "accepted" | "declined";
    specialRequests?: string;
    guestCount?: number;
    createdAt: string;
}

export default function BookedServicesPage() {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Mock data - Replace with actual API call
    useEffect(() => {
        const mockBookings: BookingRequest[] = [
            {
                id: "1",
                customerName: "Sarah Johnson",
                customerEmail: "sarah.johnson@email.com",
                customerPhone: "+1 (555) 123-4567",
                customerAddress: "123 Oak Street, Springfield, IL 62701",
                serviceName: "Premium Wedding Photography",
                serviceType: "Photography",
                bookingDate: "2024-08-25",
                eventDate: "2024-12-15",
                eventTime: "14:00",
                eventLocation: "Grand Ballroom, The Plaza Hotel",
                totalAmount: 2500,
                status: "pending",
                specialRequests: "Please include engagement photos and drone shots",
                guestCount: 150,
                createdAt: "2024-08-25T10:30:00Z"
            },
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
                status: "accepted",
                specialRequests: "White and blush pink color scheme, seasonal flowers preferred",
                guestCount: 100,
                createdAt: "2024-08-24T14:15:00Z"
            },
            {
                id: "3",
                customerName: "Emma Davis",
                customerEmail: "emma.davis@email.com",
                customerPhone: "+1 (555) 456-7890",
                customerAddress: "789 Maple Drive, Boston, MA 02101",
                serviceName: "Professional DJ Services",
                serviceType: "Entertainment",
                bookingDate: "2024-08-23",
                eventDate: "2024-10-20",
                eventTime: "18:00",
                eventLocation: "Metropolitan Event Center",
                totalAmount: 1200,
                status: "declined",
                specialRequests: "Mix of classic and modern music, wireless microphones needed",
                guestCount: 80,
                createdAt: "2024-08-23T09:45:00Z"
            },
            {
                id: "5",
                customerName: "Emma Davis",
                customerEmail: "emma.davis@email.com",
                customerPhone: "+1 (555) 456-7890",
                customerAddress: "789 Maple Drive, Boston, MA 02101",
                serviceName: "Professional DJ Services",
                serviceType: "Entertainment",
                bookingDate: "2024-08-23",
                eventDate: "2024-10-20",
                eventTime: "18:00",
                eventLocation: "Metropolitan Event Center",
                totalAmount: 1200,
                status: "accepted",
                specialRequests: "Mix of classic and modern music, wireless microphones needed",
                guestCount: 80,
                createdAt: "2024-08-23T09:45:00Z"
            }
        ];

        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
    }, []);

    // Filter bookings based on status and search term
    useEffect(() => {
        let filtered = bookings;

        if (selectedStatus !== "all") {
            filtered = filtered.filter(booking => booking.status === selectedStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    }, [bookings, selectedStatus, searchTerm]);

    const handleStatusUpdate = (bookingId: string, newStatus: "accepted" | "declined") => {
        setBookings(prev =>
            prev.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            )
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "accepted":
                return "bg-green-100 text-green-800 border-green-200";
            case "declined":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

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

    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const acceptedCount = bookings.filter(b => b.status === "accepted").length;
    const declinedCount = bookings.filter(b => b.status === "declined").length;

    return (
    <MainLayout>
        <div className="max-w-full mr-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">Booking Requests</h1>
                <p className="text-gray-600">Manage your service booking requests from customers</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-xl font-bold text-gray-900">{bookings.length}</p>
                        </div>
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Accepted</p>
                            <p className="text-xl font-bold text-green-600">{acceptedCount}</p>
                        </div>
                        <Check className="w-6 h-6 text-green-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Declined</p>
                            <p className="text-xl font-bold text-red-600">{declinedCount}</p>
                        </div>
                        <X className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
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

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-md font-medium text-gray-900 mb-2">No booking requests found</h3>
                        <p className="text-gray-600 text-sm">
                            {searchTerm || selectedStatus !== "all"
                                ? "Try adjusting your filters or search terms"
                                : "You haven't received any booking requests yet"}
                        </p>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-4">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Main Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                            <h3 className="text-md font-semibold text-gray-900">{booking.serviceName}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>

                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">{booking.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(booking.eventDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <div className="w-4 h-4" />
                                                <span className="font-medium">LKR {booking.totalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{booking.eventLocation}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <DefaultButton
                                            btnLabel="View Details"
                                            handleClick={() => {
                                                setSelectedBooking(booking);
                                                setShowDetails(true);
                                            }}
                                            Icon={<Eye className="w-4 h-4" />}
                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition w-[160px] text-sm"
                                        />

                                        {booking.status === "pending" && (
                                            <div className="flex gap-2">
                                                <DefaultButton
                                                    btnLabel="Accept"
                                                    handleClick={() => handleStatusUpdate(booking.id, "accepted")}
                                                    Icon={<Check className="w-4 h-4" />}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-[110px] text-sm !bg-green-600 hover:!bg-green-700"
                                                />
                                                <DefaultButton
                                                    btnLabel="Decline"
                                                    handleClick={() => handleStatusUpdate(booking.id, "declined")}
                                                    Icon={<X className="w-4 h-4" />}
                                                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-[110px] text-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Booking Details Modal */}
            {showDetails && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedBooking.serviceName}</h2>
                                    <p className="text-gray-600 text-sm">{selectedBooking.serviceType}</p>
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
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Name</p>
                                            <p className="font-medium text-sm">{selectedBooking.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Email</p>
                                            <p className="font-medium text-sm">{selectedBooking.customerEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Phone</p>
                                            <p className="font-medium text-sm">{selectedBooking.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Address</p>
                                            <p className="font-medium text-sm">{selectedBooking.customerAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-900 mb-3">Event Details</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Event Date</p>
                                            <p className="font-medium text-sm">{formatDate(selectedBooking.eventDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Event Time</p>
                                            <p className="font-medium text-sm">{formatTime(selectedBooking.eventTime)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Venue</p>
                                            <p className="font-medium text-sm">{selectedBooking.eventLocation}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Guest Count</p>
                                            <p className="font-medium text-sm">{selectedBooking.guestCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-900 mb-3">Booking Details</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Total Amount</p>
                                            <p className="font-medium text-md">LKR{selectedBooking.totalAmount}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-600">Booking Date</p>
                                            <p className="font-medium text-sm">{formatDate(selectedBooking.bookingDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            {selectedBooking.specialRequests && (
                                <div>
                                    <h3 className="text-md font-semibold text-gray-900 mb-3">Special Requests</h3>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-800 text-sm">{selectedBooking.specialRequests}</p>
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