"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaEye, FaToggleOn, FaToggleOff, FaSearch, FaTrash, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";

interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
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
    packages: Array<{
        name: string;
        price: string;
        features: string;
    }>;
    location: {
        address: string;
        city: string;
        district: string;
        province: string;
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
    businessName: string;
    isActive: boolean;
    joinDate: string;
    services: Service[];
}

const VendorManagement: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    // Mock data with services and reviews
    useEffect(() => {
        const mockVendors: Vendor[] = [
            {
                id: "V001",
                firstName: "John",
                lastName: "Photography",
                email: "john@photos.com",
                contactNo: "+94771234567",
                businessName: "John's Photography Studio",
                isActive: true,
                joinDate: "2024-01-15",
                services: [
                    {
                        id: "S001",
                        serviceName: "Wedding Photography Premium",
                        category: "Photography",
                        description: "Professional wedding photography with premium packages",
                        capacity: "1-200 guests",
                        rating: 4.8,
                        totalReviews: 24,
                        bookingCount: 18,
                        packages: [
                            { name: "Basic", price: "150000", features: "8 hours coverage, 500 edited photos" },
                            { name: "Premium", price: "250000", features: "12 hours coverage, 800 edited photos, videography" }
                        ],
                        location: {
                            address: "123 Main Street",
                            city: "Colombo",
                            district: "Colombo",
                            province: "Western",
                            country: "Sri Lanka"
                        },
                        photos: ["/photo1.jpg", "/photo2.jpg"],
                        reviews: [
                            {
                                id: "R001",
                                customerName: "Emily Johnson",
                                rating: 5,
                                comment: "Absolutely amazing photography! John captured every precious moment perfectly.",
                                date: "2024-08-15"
                            },
                            {
                                id: "R002",
                                customerName: "David Smith",
                                rating: 4,
                                comment: "Great quality photos and professional service. Highly recommended!",
                                date: "2024-07-22"
                            }
                        ]
                    },
                    {
                        id: "S002",
                        serviceName: "Engagement Photography",
                        category: "Photography",
                        description: "Romantic engagement photo sessions",
                        capacity: "2-10 people",
                        rating: 4.6,
                        totalReviews: 18,
                        bookingCount: 10,
                        packages: [
                            { name: "Standard", price: "75000", features: "2 hours session, 100 edited photos" }
                        ],
                        location: {
                            address: "123 Main Street",
                            city: "Colombo",
                            district: "Colombo",
                            province: "Western",
                            country: "Sri Lanka"
                        },
                        photos: ["/photo3.jpg"],
                        reviews: [
                            {
                                id: "R003",
                                customerName: "Sarah Wilson",
                                rating: 5,
                                comment: "Beautiful engagement photos! John made us feel so comfortable.",
                                date: "2024-08-01"
                            }
                        ]
                    }
                ]
            },
            {
                id: "V002",
                firstName: "Sarah",
                lastName: "Events",
                email: "sarah@events.com",
                contactNo: "+94777654321",
                businessName: "Sarah's Event Planning",
                isActive: true,
                joinDate: "2024-02-20",
                services: [
                    {
                        id: "S003",
                        serviceName: "Complete Wedding Planning",
                        category: "Wedding Planning",
                        description: "Full-service wedding planning and coordination",
                        capacity: "50-500 guests",
                        rating: 4.9,
                        totalReviews: 12,
                        bookingCount: 15,
                        packages: [
                            { name: "Full Planning", price: "500000", features: "6 months planning, venue booking, vendor coordination" }
                        ],
                        location: {
                            address: "456 Event Avenue",
                            city: "Kandy",
                            district: "Kandy",
                            province: "Central",
                            country: "Sri Lanka"
                        },
                        photos: ["/event1.jpg", "/event2.jpg"],
                        reviews: [
                            {
                                id: "R004",
                                customerName: "Michael Brown",
                                rating: 5,
                                comment: "Sarah planned our dream wedding perfectly! Every detail was taken care of.",
                                date: "2024-07-30"
                            }
                        ]
                    }
                ]
            },
            {
                id: "V003",
                firstName: "Mike",
                lastName: "Catering",
                email: "mike@catering.com",
                contactNo: "+94712345678",
                businessName: "Mike's Catering Services",
                isActive: false,
                joinDate: "2024-03-10",
                services: [
                    {
                        id: "S004",
                        serviceName: "Wedding Catering Deluxe",
                        category: "Catering",
                        description: "Premium catering services for weddings",
                        capacity: "100-1000 guests",
                        rating: 4.3,
                        totalReviews: 8,
                        bookingCount: 8,
                        packages: [
                            { name: "Basic Menu", price: "2000", features: "Per person, 3-course meal" },
                            { name: "Premium Menu", price: "3500", features: "Per person, 5-course meal with beverages" }
                        ],
                        location: {
                            address: "789 Food Street",
                            city: "Galle",
                            district: "Galle",
                            province: "Southern",
                            country: "Sri Lanka"
                        },
                        photos: ["/food1.jpg"],
                        reviews: [
                            {
                                id: "R005",
                                customerName: "Anna Davis",
                                rating: 4,
                                comment: "Good food quality and service. Menu variety was impressive.",
                                date: "2024-06-18"
                            }
                        ]
                    }
                ]
            }
        ];
        setVendors(mockVendors);
        setFilteredVendors(mockVendors);
    }, []);

    // Filter vendors based on search term and status
    useEffect(() => {
        let filtered = vendors.filter(vendor =>
            vendor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.services.some(service => 
                service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (statusFilter !== "all") {
            filtered = filtered.filter(vendor => 
                statusFilter === "active" ? vendor.isActive : !vendor.isActive
            );
        }

        setFilteredVendors(filtered);
    }, [vendors, searchTerm, statusFilter]);

    const handleToggleVendorStatus = () => {
        if (!selectedVendor) return;

        setVendors(prev =>
            prev.map(vendor =>
                vendor.id === selectedVendor.id
                    ? { ...vendor, isActive: !vendor.isActive }
                    : vendor
            )
        );

        const action = selectedVendor.isActive ? "disabled" : "enabled";
        toast.success(`Vendor ${action} successfully`);
        setShowToggleModal(false);
        setSelectedVendor(null);
    };

    const handleDeleteVendor = () => {
        if (!selectedVendor) return;

        setVendors(prev => prev.filter(vendor => vendor.id !== selectedVendor.id));
        toast.success("Vendor deleted successfully");
        setShowDeleteModal(false);
        setSelectedVendor(null);
    };

    const openDetailsModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setShowDetailsModal(true);
    };

    const openToggleModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setShowToggleModal(true);
    };

    const openDeleteModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setShowDeleteModal(true);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <AdminMainLayout>
            <div className="max-w-6xl mr-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                            Vendor Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage vendor accounts and their services</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search vendors or services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Vendors Table */}
                <div className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-purple-50 border-b border-purple-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Vendor Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Services Summary
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            {searchTerm || statusFilter !== "all" ? "No vendors found matching your criteria" : "No vendors available"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {vendor.firstName} {vendor.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{vendor.businessName}</div>
                                                    <div className="text-sm text-gray-500">{vendor.email}</div>
                                                    <div className="text-sm text-gray-500">{vendor.contactNo}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Joined: {new Date(vendor.joinDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {vendor.services.length === 0 ? (
                                                        <span className="text-sm text-gray-500 italic">No services added</span>
                                                    ) : (
                                                        vendor.services.map((service) => (
                                                            <div key={service.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">{service.serviceName}</div>
                                                                        <div className="text-xs text-purple-600 font-medium">{service.category}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="text-xs text-gray-600">
                                                                            <span className="font-medium">Bookings:</span> {service.bookingCount}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <div className="flex items-center">
                                                                                {renderStars(service.rating)}
                                                                            </div>
                                                                            <span className="text-xs text-gray-600">
                                                                                {service.rating.toFixed(1)} ({service.totalReviews})
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    vendor.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {vendor.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center space-x-3">
                                                    {/* Single Large View Button */}
                                                    <button
                                                        onClick={() => openDetailsModal(vendor)}
                                                        className="text-blue-600 hover:text-blue-900 p-3 rounded-lg hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 hover:border-blue-300"
                                                        title="View all details"
                                                    >
                                                        <FaEye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openToggleModal(vendor)}
                                                        className={`p-3 rounded-lg transition-colors shadow-sm border ${
                                                            vendor.isActive
                                                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50 border-red-200 hover:border-red-300'
                                                                : 'text-green-600 hover:text-green-900 hover:bg-green-50 border-green-200 hover:border-green-300'
                                                        }`}
                                                        title={vendor.isActive ? "Disable vendor" : "Enable vendor"}
                                                    >
                                                        {vendor.isActive ? (
                                                            <FaToggleOn className="w-5 h-5" />
                                                        ) : (
                                                            <FaToggleOff className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(vendor)}
                                                        className="text-red-600 hover:text-red-900 p-3 rounded-lg hover:bg-red-50 transition-colors shadow-sm border border-red-200 hover:border-red-300"
                                                        title="Delete vendor"
                                                    >
                                                        <FaTrash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Complete Vendor Details Modal */}
                {showDetailsModal && selectedVendor && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                                <h3 className="text-xl font-semibold text-gray-900">Complete Vendor Profile</h3>
                                <p className="text-sm text-gray-500">{selectedVendor.businessName}</p>
                            </div>
                            
                            <div className="px-6 py-6 space-y-8">
                                {/* Vendor Basic Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Vendor Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="text-sm text-gray-900">{selectedVendor.firstName} {selectedVendor.lastName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                            <p className="text-sm text-gray-900">{selectedVendor.businessName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact</label>
                                            <p className="text-sm text-gray-900">{selectedVendor.contactNo}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                            <p className="text-sm text-gray-900">{new Date(selectedVendor.joinDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                selectedVendor.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedVendor.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Total Services</label>
                                            <p className="text-lg font-semibold text-purple-600">{selectedVendor.services.length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services Details */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Services Offered</h4>
                                    {selectedVendor.services.length === 0 ? (
                                        <p className="text-gray-500 italic">No services added yet.</p>
                                    ) : (
                                        <div className="space-y-8">
                                            {selectedVendor.services.map((service) => (
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
                                                                <p className="text-sm text-gray-900">{service.description}</p>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                                                    <p className="text-sm text-gray-900">{service.capacity}</p>
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
                                                                        {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                                                <p className="text-sm text-gray-900">
                                                                    {service.location.address}, {service.location.city}, {service.location.district}, {service.location.province}, {service.location.country}
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
                                                                                <h6 className="font-medium text-gray-900">{pkg.name}</h6>
                                                                                <span className="text-lg font-semibold text-purple-600">
                                                                                    LKR {parseInt(pkg.price).toLocaleString()}
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
                                                                            <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                                                                                <span className="text-gray-500 text-xs">Photo {index + 1}</span>
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
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Status Confirmation Modal */}
                <ConfirmModal
                    open={showToggleModal}
                    onClose={() => setShowToggleModal(false)}
                    title={selectedVendor?.isActive ? "Disable Vendor" : "Enable Vendor"}
                    message={`Are you sure you want to ${selectedVendor?.isActive ? 'disable' : 'enable'} "${selectedVendor?.businessName}"?`}
                    confirmText={selectedVendor?.isActive ? "Disable" : "Enable"}
                    cancelText="Cancel"
                    variant={selectedVendor?.isActive ? "danger" : "default"}
                    onConfirm={handleToggleVendorStatus}
                />

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Vendor"
                    message={`Are you sure you want to permanently delete "${selectedVendor?.businessName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteVendor}
                />
            </div>
        </AdminMainLayout>
    );
};

export default VendorManagement;