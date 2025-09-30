import React from "react";
import { FaCalendar, FaUser, FaStar, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

export interface Booking {
    id: string;
    serviceId: string;
    customerId: string;
    status: string;
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
    packageName?: string;
    price?: number;
    eventDate?: string;
    review?: {
        id: string;
        rating: number;
        comment: string;
        createdAt: string;
        customerId: string;
        serviceId: string;
    };
}

interface Props {
    bookings: Booking[];
    serviceName: string;
}

const BookingDetails: React.FC<Props> = ({ bookings, }) => {
    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            case "interested":
                return "bg-purple-100 text-purple-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));

    // Format full address from customer details
    const formatFullAddress = (customer: Booking['customer']) => {
        const addressParts = [
            customer.address,
            customer.city,
            customer.distric,
            customer.province,
            customer.country
        ].filter(part => part && part.trim() !== '');

        return addressParts.length > 0 ? addressParts.join(', ') : 'Address not provided';
    };

    // Filter out bookings that don't have customer data
    const validBookings = bookings.filter(booking =>
        booking.customer && booking.status.toUpperCase() !== 'INTERESTED'
    );

    if (validBookings.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaCalendar className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                <p className="text-gray-500">This service hasn&apos;t received any bookings yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {validBookings.length} {validBookings.length === 1 ? 'booking' : 'bookings'}
                </span>
            </div>

            <div className="space-y-6">
                {validBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {/* Customer Information Section */}
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <FaUser className="text-purple-600 w-4 h-4" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900 text-lg">
                                            {booking.customer.firstName} {booking.customer.lastName}
                                        </h5>
                                        <p className="text-sm text-gray-500">Customer ID: {booking.customer.userId}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                                </span>
                            </div>

                            {/* Customer Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-gray-400 w-4 h-4" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm font-medium text-gray-900">{booking.customer.email}</p>
                                        </div>
                                    </div>
                                    {booking.customer.contactNo ? (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400 w-4 h-4" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-900">{booking.customer.contactNo}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="text-gray-400 w-4 h-4" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-500 italic">Not provided</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <FaMapMarkerAlt className="text-gray-400 w-4 h-4 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Address</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatFullAddress(booking.customer)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <FaCalendar className="text-gray-400 w-4 h-4" />
                                <div>
                                    <p className="text-xs text-gray-500">Booking Date</p>
                                    <p className="text-sm font-medium">
                                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                            {/* Package and Price combined in one section */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-purple-600 font-medium">Package</p>
                                        <p className="text-sm font-semibold text-gray-900">{booking.packageName || "Standard Package"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-purple-600 font-medium">Price</p>
                                        <p className="text-lg font-bold text-purple-700">
                                            LKR {booking.price ? booking.price.toLocaleString() : "0"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                    </div>

                        {/* Confirmation Status */ }
                    < div className = "mb-4" > {
                        booking.confirmedAt && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-green-800">
                                    <strong>✓ Confirmed on:</strong> {new Date(booking.confirmedAt).toLocaleDateString()
                                    }
                                </p>
                            </div>
                        )
                    }

                    {
                        booking.cancelledAt && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                                <p className="text-sm text-red-800">
                                    <strong>✗ Declined on:</strong> {new Date(booking.cancelledAt).toLocaleDateString()}
                                </p>
                            </div>
                        )
                    }
                    </div>


            {/* Review Section */}
            {booking.review ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                            {renderStars(booking.review.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {booking.review.rating.toFixed(1)} Rating
                        </span>
                        <span className="text-sm text-gray-500">
                            • {new Date(booking.review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        `{booking.review.comment}`
                    </p>
                </div>
            ) : (
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <p className="text-sm text-gray-500 text-center italic">
                        No review provided for this booking
                    </p>
                </div>
            )}
        </div>
    ))
}
            </div >
        </div >
    );
};

export default BookingDetails;