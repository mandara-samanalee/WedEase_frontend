import React from "react";
import { FaStar } from "react-icons/fa";

interface Service {
    id?: number;
    serviceId?: string;
    serviceName?: string;
    category?: string;
    description?: string;
    capacity?: string;
    isActive?: boolean;
    latitude?: number | null;
    longitude?: number | null;
    country?: string | null;
    state?: string | null;
    district?: string | null;
    city?: string | null;
    address?: string | null;
    vendorId?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Booking {
    id: string;
    serviceId?: string;
    customerId?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    confirmedAt?: string | null;
    cancelledAt?: string | null;
    service?: Service;
}

interface Review {
    id: number;
    serviceId?: string;
    customerId?: string;
    bookingId?: string;
    rating: number;
    comment?: string;
    createdAt?: string;
    updatedAt?: string;
    service?: Service;
}

interface WeddingEvent {
    id: string;
    title?: string;
    GroomName?: string;
    BrideName?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    Description?: string;
    GuestCount?: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    agenda?: unknown[];
    checklist?: unknown[];
    budget?: unknown[];
    guests?: unknown[];
}

interface User {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    address?: string | null;
    city?: string | null;
    distric?: string | null;
    province?: string | null;
    country?: string | null;
    contactNo?: string | null;
    image?: string | null;
    createdAt: string;
    weddingEventId?: string | null;
    weddingEvent?: WeddingEvent | null;
    bookings?: Booking[];
    reviews?: Review[];
    totalBookings: number;
    totalReviews: number;
    isActive?: boolean;
    lastLogin?: string;
    averageRating?: number;
}

interface UserProps {
    user: User;
    onClose: () => void;
}

const ViewCustomerModal: React.FC<UserProps> = ({ user, onClose }) => {
    const renderStars = (rating = 0) =>
        Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ));

    const getFullAddress = () => {
        const parts = [
            user.address,
            user.city,
            user.distric,
            user.province,
            user.country
        ].filter(Boolean);
        return parts.length ? parts.join(", ") : "Not provided";
    };

    const bookingList = user.bookings || [];

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'INTERESTED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Customer Profile
                    </h3>
                </div>

                <div className="px-6 py-6 space-y-8">
                    {/* Basic Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="text-sm text-gray-900">{user.email || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact</label>
                                <p className="text-sm text-gray-900">{user.contactNo || "—"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <p className="text-sm text-gray-900">{getFullAddress()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                <p className="text-sm text-gray-900">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Bookings</label>
                                <p className="text-lg font-semibold text-purple-600">{user.totalBookings ?? 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Wedding Event Information */}
                    {user.weddingEvent && (
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Wedding Event Details</h4>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                        <p className="text-sm text-gray-900">{user.weddingEvent.title || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Couple</label>
                                        <p className="text-sm text-gray-900">
                                            {user.weddingEvent.GroomName} & {user.weddingEvent.BrideName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                                        <p className="text-sm text-gray-900">
                                            {user.weddingEvent.date ? new Date(user.weddingEvent.date).toLocaleDateString() : "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location</label>
                                        <p className="text-sm text-gray-900">{user.weddingEvent.location || "—"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Guest Count</label>
                                        <p className="text-sm text-gray-900">{user.weddingEvent.GuestCount || 0}</p>
                                    </div>
                                    {user.weddingEvent.Description && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <p className="text-sm text-gray-900">{user.weddingEvent.Description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booked Services / Bookings */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Booked Services</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {bookingList.length === 0 ? (
                                <p className="text-gray-500 italic">No bookings</p>
                            ) : (
                                bookingList.map((booking, idx) => {
                                    const svcName = booking.service?.serviceName || "Unknown service";
                                    const category = booking.service?.category || "";
                                    const date = booking.createdAt || "";
                                    const status = booking.status || "UNKNOWN";
                                    return (
                                        <div key={booking.id || idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{svcName}</h5>
                                                    <p className="text-sm text-purple-600">{category}</p>
                                                </div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Booking Date: {date ? new Date(date).toLocaleDateString() : "—"}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Reviews & Ratings */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Reviews & Ratings given</h4>
                        <div className="space-y-4">
                            {(!user.reviews || user.reviews.length === 0) ? (
                                <p className="text-gray-500 italic">No reviews yet</p>
                            ) : (
                                user.reviews.map((review) => (
                                    <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h5 className="font-medium text-gray-900">
                                                    {review.service?.serviceName || "Service"}
                                                </h5>
                                                <p className="text-sm text-purple-600">
                                                    {review.service?.category || ""}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex items-center mr-2">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-sm text-gray-700 mb-3 italic">&quot;{review.comment}&quot;</p>
                                        )}
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>
                                                Review Date: {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "—"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCustomerModal;