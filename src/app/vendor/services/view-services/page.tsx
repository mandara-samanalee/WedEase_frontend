/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/VendorLayout/MainLayout";
import { FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/Services/StatsCards";
import ServiceCard from "@/components/Services/ServiceCard";
import ServiceDetailsModal from "@/components/Services/ServiceDetailsModal";
import { Service } from "@/components/Services/Types";
import { GiDiamondRing } from "react-icons/gi";
import { Loader } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: string;
  serviceId: string;
}

interface Booking {
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
  review?: Review;
}

interface ServiceReview {
  id: number;
  serviceId: string;
  customerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorServiceWithBookings {
  id: number;
  serviceId: string;
  serviceName: string;
  category: string;
  description: string;
  capacity: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city: string;
  address: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  packages: Array<{
    id: number;
    packageName: string;
    price: number;
    features: string;
    serviceId: string;
  }>;
  photos: Array<{
    id: number;
    imageUrl: string;
    serviceId: string;
  }>;
  reviews?: ServiceReview[];
}

const MyServices: React.FC = () => {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vendorServicesData, setVendorServicesData] = useState<VendorServiceWithBookings[]>([]);

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

    const fetchVendorServicesWithBookings = async () => {
        const { vendorId, token } = getVendorId();
        if (!vendorId || !token) {
            toast.error("Vendor ID not found. Please login again.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${BASE_URL}/booking/vendor/${vendorId}`, {
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
                throw new Error(`Failed to load vendor data: ${response.status}`);
            }

            const result = await response.json();
            const vendorServices: VendorServiceWithBookings[] = result.data;

            if (!vendorServices || !Array.isArray(vendorServices) || vendorServices.length === 0) {
                setServices([]);
                setFilteredServices([]);
                setLoading(false);
                return;
            }

            const servicesWithReviews = await Promise.all(
                vendorServices.map(async (service) => {
                    try {
                        const reviewResponse = await fetch(
                            `${BASE_URL}/review/service`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    serviceId: service.serviceId
                                })
                            }
                        );

                        if (reviewResponse.ok) {
                            const reviewResult = await reviewResponse.json();
                            return {
                                ...service,
                                reviews: reviewResult.data || [],
                            };
                        }
                        return { ...service, reviews: [] };
                    } catch (error) {
                        console.error(`Error fetching reviews for ${service.serviceId}:`, error);
                        return { ...service, reviews: [] };
                    }
                })
            );

            setVendorServicesData(servicesWithReviews);

            const transformedServices: Service[] = servicesWithReviews.map((service) => {
                const validBookings = (service.bookings || []).filter(booking => 
                    booking.status.toUpperCase() !== "INTERESTED"
                );

                const apiReviews = service.reviews || [];
                const totalReviews = apiReviews.length;
                
                const rating = totalReviews > 0
                    ? apiReviews.reduce((sum: any, review: { rating: any; }) => sum + review.rating, 0) / totalReviews
                    : 0;
                const roundedRating = Math.round(rating * 10) / 10;

                return {
                    id: service.serviceId,
                    serviceId: service.serviceId,
                    serviceName: service.serviceName,
                    category: service.category,
                    description: service.description || "No description available",
                    capacity: service.capacity || "Not specified",
                    rating: roundedRating,
                    totalReviews: totalReviews,
                    bookingCount: validBookings.length,
                    packages: service.packages ? service.packages.map(pkg => ({
                        name: pkg.packageName,
                        price: pkg.price.toString(),
                        features: pkg.features
                    })) : [],
                    location: {
                        address: service.address || "",
                        city: service.city || "",
                        district: service.district || "",
                        province: service.state || "",
                        country: service.country || ""
                    },
                    photos: service.photos ? service.photos.map(photo => photo.imageUrl) : [],
                    reviews: [],
                    isActive: service.isActive !== undefined ? service.isActive : true,
                    createdDate: service.createdAt || new Date().toISOString()
                };
            });
            
            setServices(transformedServices);
            setFilteredServices(transformedServices);
        } catch (error) {
            console.error("Error fetching vendor services:", error);
            setError("Failed to load services. Please try again.");
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorServicesWithBookings();
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

    const toggleServiceStatus = (serviceId: string) => {
        setServices(prev =>
            prev.map(service =>
                service.id === serviceId
                    ? { ...service, isActive: !service.isActive }
                    : service
            )
        );
    };

    const openDetailsModal = (service: Service) => {
        setSelectedService(service);
        setShowDetailsModal(true);
    };

    const handleDeleteSuccess = (serviceId: string) => {
        setServices(prevServices => prevServices.filter(s => s.id !== serviceId));
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="max-w-6xl mr-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
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
                                onClick={fetchVendorServicesWithBookings}
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
                                toggleServiceStatus={toggleServiceStatus}
                                onDeleteSuccess={handleDeleteSuccess}
                            />
                        ))
                    )}
                </div>

                <ServiceDetailsModal
                    open={showDetailsModal}
                    service={selectedService}
                    onClose={() => setShowDetailsModal(false)}
                    vendorService={selectedService ? vendorServicesData.find(vs => vs.serviceId === selectedService.id) : null}
                />
            </div>
        </MainLayout>
    );
};

export default MyServices;