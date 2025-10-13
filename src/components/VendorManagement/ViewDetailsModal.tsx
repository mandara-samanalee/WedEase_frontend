import React from "react";
import { FaStar } from "react-icons/fa";

interface Review {
    id: number;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
}

interface Package {
    name: string;
    price: number;
    features: string;
}

interface Service {
    id: string;
    serviceName: string;
    category: string;
    description: string;
    capacity: string;
    rating: number;
    totalReviews: number;
    bookingCount: number;
    packages: Package[];
    location: {
        address: string;
        city: string;
        district: string;
        country: string;
    };
    photos: string[];
    reviews: Review[];
}

interface Vendor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    isActive: boolean;
    joinDate: string;
    address?: string;  
    city?: string;     
    province?: string; 
    country?: string;
    services: Service[];
}

interface VendorDetailsModalProps {
    vendor: Vendor;
    onClose: () => void;
}

const VendorDetailsModal: React.FC<VendorDetailsModalProps> = ({ vendor, onClose }) => {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    // Format full address
    const getFullAddress = () => {
        const parts = [
            vendor.address,
            vendor.city,
            vendor.province,
            vendor.country
        ].filter(Boolean); 
        
        return parts.length > 0 ? parts.join(', ') : 'Not provided';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900">Vendor Profile</h3>
                </div>
                
                <div className="px-6 py-6 space-y-8">
                    {/* Vendor Basic Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Vendor Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="text-sm text-gray-900">{vendor.firstName} {vendor.lastName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="text-sm text-gray-900">{vendor.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact</label>
                                <p className="text-sm text-gray-900">{vendor.contactNo}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <p className="text-sm text-gray-900">{getFullAddress()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                <p className="text-sm text-gray-900">{new Date(vendor.joinDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    vendor.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {vendor.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Services</label>
                                <p className="text-lg font-semibold text-purple-600">{vendor.services.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Services Details */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Services Offered</h4>
                        {vendor.services.length === 0 ? (
                            <p className="text-gray-500 italic">No services added yet.</p>
                        ) : (
                            <div className="space-y-8">
                                {vendor.services.map((service) => (
                                    <div key={service.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Service Basic Info */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h5 className="text-lg font-medium text-gray-900">{service.serviceName}</h5>
                                                    <p className="text-sm text-purple-600 font-medium">{service.category}</p>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                                    <p className="text-sm text-gray-900">{service.description || 'No description provided'}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                                        <p className="text-sm text-gray-900">{service.capacity || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Bookings</label>
                                                        <p className="text-sm text-gray-900 font-semibold">{service.bookingCount}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center">
                                                            {renderStars(service.rating)}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            {service.rating > 0 ? service.rating.toFixed(1) : 'No ratings'} ({service.totalReviews} reviews)
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                                    <p className="text-sm text-gray-900">
                                                        {service.location.address && `${service.location.address}, `}
                                                        {service.location.city}, {service.location.district}, {service.location.country}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Pricing Packages */}
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Packages</label>
                                                    <div className="space-y-3">
                                                        {service.packages.map((pkg, index) => (
                                                            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h6 className="font-medium text-gray-900 capitalize">{pkg.name}</h6>
                                                                    <span className="text-lg font-semibold text-purple-600">
                                                                        LKR {pkg.price.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{pkg.features}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Service Photos */}
                                                {service.photos.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Photos</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {service.photos.slice(0, 4).map((photo, index) => (
                                                                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                                    <img 
                                                                        src={photo} 
                                                                        alt={`${service.serviceName} - Photo ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = '';
                                                                            e.currentTarget.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {service.photos.length > 4 && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                +{service.photos.length - 4} more photos
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reviews Section */}
                                        <div className="mt-6 pt-6 border-t border-gray-300">
                                            <h6 className="text-md font-semibold text-gray-900 mb-4">Customer Reviews</h6>
                                            {service.reviews.length === 0 ? (
                                                <p className="text-gray-500 italic text-sm">No reviews yet.</p>
                                            ) : (
                                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                                    {service.reviews.map((review) => (
                                                        <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h6 className="text-sm font-medium text-gray-900">{review.customerName}</h6>
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        {renderStars(review.rating)}
                                                                        <span className="text-xs text-gray-600 ml-1">{review.rating}.0</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(review.date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700">{review.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

export default VendorDetailsModal;