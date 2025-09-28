"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { FaSpinner, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/Services/StatsCards";
import ServiceCard from "@/components/Services/ServiceCard";
import ServiceDetailsModal from "@/components/Services/ServiceDetailsModal";
import { Service } from "@/components/Services/Types";
import { GiDiamondRing } from "react-icons/gi";

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

    const getVendorId = () => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (!userData) {
                console.warn("No user data found in localStorage");
                return { vendorId: undefined, token: token || "" };
            }

            const vendor = JSON.parse(userData);

            // Check for both possible property names
            const vendorId = vendor.userId || vendor.userId;

            if (!vendorId) {
                console.warn("Vendor ID not found in user data:", vendor);
                return { vendorId: undefined, token: token || "" };
            }

            return { vendorId, token: token || "" };
        } catch (error) {
            console.error("Error parsing vendor data:", error);
            return { vendorId: undefined, token: "" };
        }
    };

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

            const result = await response.json();
            const data = result.data;

            if (!data || !Array.isArray(data) || data.length === 0) {
                setServices([]);
                setFilteredServices([]);
                setLoading(false);
                return;
            }

            // Correct transformation based on your API response
            const transformedServices: Service[] = data.map((service) => ({
                id: service.serviceId || service.id, // Use serviceId from API
                serviceName: service.serviceName,
                category: service.category,
                description: service.description || "No description available",
                capacity: service.capacity || "Not specified",
                rating: 0, // Default since not in API
                totalReviews: 0, // Default since not in API
                bookingCount: 0, // Default since not in API
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                packages: service.packages ? service.packages.map((pkg: any) => ({
                    name: pkg.packageName,
                    price: pkg.price.toString(),
                    features: pkg.features
                })) : [],
                location: {
                    address: service.address || "",
                    city: service.city || "",
                    district: service.district || "",
                    province: service.state || "", // Map state to province
                    country: service.country || ""
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                photos: service.photos ? service.photos.map((photo: any) => photo.imageUrl) : [],
                reviews: [], // Default empty array
                isActive: service.isActive !== undefined ? service.isActive : true,
                createdDate: service.createdAt || new Date().toISOString()
            }));

            console.log("Transformed services:", transformedServices); 
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
                            My Services
                        </h1>
                        <p className="text-gray-600">Manage and monitor your service offerings</p>
                    </div>
                </div>

                <StatsCards services={services} />

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services.length === 0 ? (
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
                        filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                openDetailsModal={openDetailsModal}
                                handleEditService={handleEditService}
                                toggleServiceStatus={toggleServiceStatus}
                            />
                        ))
                    )}
                </div>

                <ServiceDetailsModal
                    open={showDetailsModal}
                    service={selectedService}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={handleEditService}
                />

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