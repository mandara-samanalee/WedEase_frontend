"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaEye, FaToggleOn, FaToggleOff, FaSearch, FaTrash, FaStar } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";
import VendorDetailsModal from "@/components/VendorManagement/ViewDetailsModal";
import DeleteVendorModal from "@/components/VendorManagement/DeleteVendorModal";

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

const VendorManagement: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch vendors from API
    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        if (!BASE_URL) {
            toast.error("Backend URL not configured");
            setLoading(false);
            return;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            toast.error("Not authenticated");
            setLoading(false);
            return;
        }

        let token: string | undefined;
        try {
            const parsed = JSON.parse(raw);
            token = parsed?.token;
        } catch {
            toast.error("Invalid session");
            setLoading(false);
            return;
        }

        if (!token) {
            toast.error("Authentication token missing");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/vendor/all-vendors-details`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch vendors");
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                setVendors(result.data);
                setFilteredVendors(result.data);
            } else {
                toast.error("Failed to load vendors");
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error("Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    // Filter vendors based on search term and status
    useEffect(() => {
        let filtered = vendors.filter(vendor =>
            vendor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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


    // handle toggle vendor status
    const handleToggleVendorStatus = async () => {
        if (!selectedVendor) return;

        if (!BASE_URL) {
            toast.error("Backend URL not configured");
            return;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            toast.error("Not authenticated");
            return;
        }

        let token: string;
        try {
            const parsed = JSON.parse(raw);
            token = parsed?.token;
        } catch {
            toast.error("Invalid session");
            return;
        }

        if (!token) {
            toast.error("Authentication token missing");
            return;
        }

        try {
            const newStatus = !selectedVendor.isActive;

            const response = await fetch(`${BASE_URL}/user/status/${selectedVendor.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    isActive: newStatus
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setVendors(prev =>
                    prev.map(vendor =>
                        vendor.id === selectedVendor.id
                            ? { ...vendor, isActive: newStatus }
                            : vendor
                    )
                );

                const action = newStatus ? "enabled" : "disabled";
                toast.success(result.message || `Vendor ${action} successfully`);
                setShowToggleModal(false);
                setSelectedVendor(null);
            } else {
                toast.error(result.message || "Failed to update vendor status");
            }
        } catch (error) {
            console.error("Error toggling vendor status:", error);
            toast.error("An error occurred while updating vendor status");
        } 
    };


    // delete vendor handle
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
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="animate-spin w-8 h-8 text-purple-600 mx-auto" />
                        </div>
                    ) : (
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
                                                        {vendor.city && (
            <div className="text-sm text-gray-500">{vendor.city}</div>
        )}
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
                                                                                    {service.rating > 0 ? service.rating.toFixed(1) : 'N/A'} ({service.totalReviews})
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
                    )}
                </div>

                {/* Vendor Details Modal */}
                {showDetailsModal && selectedVendor && (
                    <VendorDetailsModal 
                        vendor={selectedVendor} 
                        onClose={() => setShowDetailsModal(false)} 
                    />
                )}

                {/* Toggle Status Confirmation Modal */}
                <ConfirmModal
                    open={showToggleModal}
                    onClose={() => setShowToggleModal(false)}
                    title={selectedVendor?.isActive ? "Disable Vendor" : "Enable Vendor"}
                    message={`Are you sure you want to ${selectedVendor?.isActive ? 'disable' : 'enable'} "${selectedVendor?.firstName} ${selectedVendor?.lastName}"?`}
                    confirmText={selectedVendor?.isActive ? "Disable" : "Enable"}
                    cancelText="Cancel"
                    variant={selectedVendor?.isActive ? "danger" : "default"}
                    onConfirm={handleToggleVendorStatus}
                />

                {/* Delete Vendor Modal */}
                {showDeleteModal && selectedVendor && (
                    <DeleteVendorModal
                        vendor={selectedVendor}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteVendor}
                    />
                )}
            </div>
        </AdminMainLayout>
    );
};

export default VendorManagement;