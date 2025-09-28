"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { FaEdit, FaEye, FaStar, FaMapMarkerAlt, FaUsers, FaPlus, FaSearch, FaSpinner } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";
import { useRouter } from "next/navigation";

interface Package {
    name: string;
    price: string;
    features: string;
}

interface Location {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
}

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
    packages: Package[];
    location: Location;
    photos: string[];
    reviews: Review[];
    isActive: boolean;
    createdDate: string;
}

const MyServices: React.FC = () => {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Get vendor ID from localStorage or context
    const getVendorId = () => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");
            if (userData) {
                const vendor = JSON.parse(userData);
                return { vendorId:vendor.userId, token };
            }
            return { vendorId: undefined, token: token || "" };
        } catch (error) {
            console.error("Error parsing vendor data:", error);
            return { vendorId: undefined, token: "" };
        }
    };

    // Fetch services from API
    const fetchServices = async () => {
        const { vendorId, token } = getVendorId();
        
        if (!vendorId || !token) {
            toast.error("Vendor ID not found. Please login again.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${BASE_URL}/service/getAll/${vendorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setServices([]);
                    setFilteredServices([]);
                    setLoading(false);
                    return;
                }
                throw new Error(`Failed to load Service details: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle empty array response
            if (!data || !Array.isArray(data) || data.length === 0) {
                setServices([]);
                setFilteredServices([]);
                setLoading(false);
                return;
            }
            
            // Transform API data to match our interface if needed
            const transformedServices: Service[] = data.map((service) => ({
                id: service._id || service.id,
                serviceName: service.serviceName || service.name,
                category: service.category,
                description: service.description,
                capacity: service.capacity,
                rating: service.rating || 0,
                totalReviews: service.totalReviews || service.reviews?.length || 0,
                bookingCount: service.bookingCount || 0,
                packages: service.packages || [],
                location: service.location || {
                    address: "",
                    city: "",
                    district: "",
                    province: "",
                    country: ""
                },
                photos: service.photos || [],
                reviews: service.reviews || [],
                isActive: service.isActive !== undefined ? service.isActive : true,
                createdDate: service.createdDate || service.createdAt || new Date().toISOString()
            }));

            setServices(transformedServices);
            setFilteredServices(transformedServices);
        } catch (error) {
            console.error("Error fetching services:", error);
            setError("Failed to load services. Please try again.");
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Filter services
    useEffect(() => {
        let filtered = services.filter(service =>
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (categoryFilter !== "all") {
            filtered = filtered.filter(service => service.category === categoryFilter);
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(service => 
                statusFilter === "active" ? service.isActive : !service.isActive
            );
        }

        setFilteredServices(filtered);
    }, [services, searchTerm, categoryFilter, statusFilter]);

    const handleDeleteService = async () => {
        if (!selectedService) return;

        try {
            // Add delete API call here if needed
            // const response = await fetch(`http://localhost:5000/api/service/delete/${selectedService.id}`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to delete service');
            // }

            setServices(prev => prev.filter(service => service.id !== selectedService.id));
            toast.success("Service deleted successfully");
            setShowDeleteModal(false);
            setSelectedService(null);
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Failed to delete service");
        }
    };

    const toggleServiceStatus = async (serviceId: string) => {
        try {
            // Add toggle status API call here if needed
            // const service = services.find(s => s.id === serviceId);
            // const response = await fetch(`http://localhost:5000/api/service/updateStatus/${serviceId}`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ isActive: !service?.isActive }),
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to update service status');
            // }

            setServices(prev =>
                prev.map(service =>
                    service.id === serviceId
                        ? { ...service, isActive: !service.isActive }
                        : service
                )
            );
            toast.success("Service status updated successfully");
        } catch (error) {
            console.error("Error updating service status:", error);
            toast.error("Failed to update service status");
        }
    };

    const openDetailsModal = (service: Service) => {
        setSelectedService(service);
        setShowDetailsModal(true);
    };

    const handleEditService = (serviceId: string) => {
        router.push(`/vendor/services/edit/${serviceId}`);
    };

    const handleRetry = () => {
        fetchServices();
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    // Loading state
    if (loading) {
        return (
            <MainLayout>
                <div className="max-w-6xl mr-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading your services...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Error state (only for actual errors, not empty results)
    if (error) {
        return (
            <MainLayout>
                <div className="max-w-6xl mr-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Services</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mr-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
                            My Services
                        </h1>
                        <p className="text-gray-600">Manage and monitor your service offerings</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Total Services</p>
                                <p className="text-2xl font-bold">{services.length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <GiDiamondRing className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Active Services</p>
                                <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaEye className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Bookings</p>
                                <p className="text-2xl font-bold">{services.reduce((sum, s) => sum + s.bookingCount, 0)}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaUsers className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Avg Rating</p>
                                <p className="text-2xl font-bold">
                                    {services.length > 0 ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1) : '0.0'}
                                </p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-lg">
                                <FaStar className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Grid or Empty State */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services.length === 0 ? (
                        // No services at all (empty state)
                        <div className="col-span-full text-center py-16">
                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                                <GiDiamondRing className="text-6xl text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Your Services Dashboard!</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                You haven&apos;t created any services yet. Start by adding your first service to showcase your wedding offerings to potential clients.
                            </p>
                            <button
                                onClick={() => router.push('/vendor/services/add')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center gap-2 mx-auto"
                            >
                                <FaPlus className="w-5 h-5" />
                                Register Your Services
                            </button>
                        </div>
                    ) : filteredServices.length === 0 ? (
                        // Services exist but filtered out
                        <div className="col-span-full text-center py-12">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="text-4xl text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Match Your Search</h3>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search terms or filters to find what you&apos;re looking for.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setCategoryFilter("all");
                                    setStatusFilter("all");
                                }}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        // Show services
                        filteredServices.map((service) => (
                            <div key={service.id} className="mt-6 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                {/* Service Image */}
                                <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <GiDiamondRing className="text-6xl text-white/80" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            service.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/90 px-2 py-1 rounded-lg text-xs font-semibold text-purple-700">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Service Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                                        {service.serviceName}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <span className="text-sm">
                                                {service.rating.toFixed(1)} ({service.totalReviews})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-purple-500 w-4 h-4" />
                                            <span className="text-sm">{service.bookingCount} bookings</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-gray-400 w-4 h-4" />
                                            <span className="text-sm">{service.location.city || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                {service.packages.length} packages
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500">Starting from</p>
                                        <p className="text-lg font-bold text-purple-700">
                                            {service.packages.length > 0 
                                                ? `LKR ${Math.min(...service.packages.map(p => parseInt(p.price) || 0)).toLocaleString()}`
                                                : 'Price on request'
                                            }
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openDetailsModal(service)}
                                            className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditService(service.id)}
                                            className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleServiceStatus(service.id)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                service.isActive
                                                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {service.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Service Details Modal */}
                {showDetailsModal && selectedService && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedService.serviceName}</h3>
                                        <p className="text-purple-600 font-medium">{selectedService.category}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <p className="text-gray-900">{selectedService.description}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                            <p className="text-gray-900">{selectedService.capacity}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">{renderStars(selectedService.rating)}</div>
                                                <span className="text-gray-600">
                                                    {selectedService.rating.toFixed(1)} ({selectedService.totalReviews} reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Bookings</label>
                                            <p className="text-gray-900 font-semibold">{selectedService.bookingCount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
                                    <p className="text-gray-900">
                                        {selectedService.location.address && `${selectedService.location.address}, `}
                                        {selectedService.location.city && `${selectedService.location.city}, `}
                                        {selectedService.location.district && `${selectedService.location.district}, `}
                                        {selectedService.location.province && `${selectedService.location.province}, `}
                                        {selectedService.location.country || 'Location not specified'}
                                    </p>
                                </div>

                                {/* Packages */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h4>
                                    {selectedService.packages.length === 0 ? (
                                        <p className="text-gray-500 italic">No packages available</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {selectedService.packages.map((pkg, index) => (
                                                <div key={index} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                                                        <span className="text-lg font-bold text-purple-700">
                                                            LKR {parseInt(pkg.price || '0').toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{pkg.features}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Recent Reviews */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h4>
                                    {selectedService.reviews.length === 0 ? (
                                        <p className="text-gray-500 italic">No reviews yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedService.reviews.slice(0, 3).map((review) => (
                                                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h6 className="font-medium text-gray-900">{review.customerName}</h6>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(review.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{review.comment}</p>
                                                </div>
                                            ))}
                                            {selectedService.reviews.length > 3 && (
                                                <p className="text-center text-purple-600 font-medium">
                                                    +{selectedService.reviews.length - 3} more reviews
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => handleEditService(selectedService.id)}
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Edit Service
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Service"
                    message={`Are you sure you want to permanently delete "${selectedService?.serviceName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteService}
                />
            </div>
        </MainLayout>
    );
};

export default MyServices;