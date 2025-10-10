/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaEye, FaToggleOn, FaToggleOff, FaSearch, FaTrash, FaStar } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";
import ViewCustomerModal from "@/components/CustomerManagement/ViewCustomerDetails";
import DeleteCustomerModal from "@/components/CustomerManagement/DeleteCustomerModal";

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

const CustomerManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch customers from API
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
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

        let token: string;
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
            const response = await fetch(`${BASE_URL}/customer/all-customer-details`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }

            const result = await response.json();

            if (result.success && result.data) {
                // Calculate average rating for each customer
                const customersWithRating = result.data.map((customer: any) => {
                    const reviews = customer.reviews || [];
                    const avgRating = reviews.length > 0
                        ? reviews.reduce((sum: number, review: Review) => sum + (review.rating || 0), 0) / reviews.length
                        : 0;
                    return {
                        ...customer,
                        averageRating: avgRating,
                        isActive: customer.isActive ?? true // Default to active if not provided
                    } as User;
                });
                setUsers(customersWithRating);
                setFilteredUsers(customersWithRating);
            } else {
                toast.error("Failed to load customers");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search term and status
    useEffect(() => {
        let filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.weddingEvent?.GroomName && user.weddingEvent.GroomName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.weddingEvent?.BrideName && user.weddingEvent.BrideName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.weddingEvent?.location && user.weddingEvent.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (statusFilter !== "all") {
            filtered = filtered.filter(user =>
                statusFilter === "active" ? user.isActive : !user.isActive
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, statusFilter]);

    const handleToggleUserStatus = async () => {
        if (!selectedUser) return;

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
            const newStatus = !selectedUser.isActive;

            const response = await fetch(`${BASE_URL}/user/status/${selectedUser.userId}`, {
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
                setUsers(prev =>
                    prev.map(user =>
                        user.userId === selectedUser.userId
                            ? { ...user, isActive: newStatus }
                            : user
                    )
                );

                const action = newStatus ? "enabled" : "disabled";
                toast.success(result.message || `Customer ${action} successfully`);
                setShowToggleModal(false);
                setSelectedUser(null);
            } else {
                toast.error(result.message || "Failed to update customer status");
            }
        } catch (error) {
            console.error("Error toggling customer status:", error);
            toast.error("An error occurred while updating customer status");
        }
    };


const handleDeleteUser = async (userId: string) => {
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
        const response = await fetch(`${BASE_URL}/customer/delete-account/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Remove user from state
            setUsers(prev => prev.filter(user => user.userId !== userId));
            toast.success(result.message || "Customer deleted successfully");
            setShowDeleteModal(false);
            setSelectedUser(null);
        } else {
            toast.error(result.message || "Failed to delete customer");
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
        toast.error("An error occurred while deleting customer");
    }
};


    const openDetailsModal = (user: User) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const openToggleModal = (user: User) => {
        setSelectedUser(user);
        setShowToggleModal(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const getWeddingStatus = (weddingDate?: string) => {
        if (!weddingDate) return { status: "No Event", color: "bg-gray-100 text-gray-800" };
        
        const today = new Date();
        const wedding = new Date(weddingDate);
        const diffTime = wedding.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: "Completed", color: "bg-gray-100 text-gray-800" };
        if (diffDays <= 30) return { status: "Upcoming", color: "bg-orange-100 text-orange-800" };
        return { status: "Planning", color: "bg-blue-100 text-blue-800" };
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
                            Customer Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage customer accounts and wedding planning progress</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search customers, city, wedding details..."
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

                {/* Users Table */}
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
                                            Customer Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                            Wedding Information
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                            Activity & Analytics
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
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                {searchTerm || statusFilter !== "all" ? "No customers found matching your criteria" : "No customers available"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => {
                                            const weddingStatus = getWeddingStatus(user.weddingEvent?.date);
                                            return (
                                                <tr key={user.userId} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.firstName} {user.lastName}
                                                            </div>
                                                            {user.city && (
                                                                <div className="text-sm text-gray-500">{user.city}</div>
                                                            )}
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                            <div className="text-sm text-gray-500">{user.contactNo || "—"}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col space-y-1">
                                                            {user.weddingEvent ? (
                                                                <>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {user.weddingEvent.GroomName} & {user.weddingEvent.BrideName}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        📅 {user.weddingEvent.date ? new Date(user.weddingEvent.date).toLocaleDateString() : "—"}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        📍 {user.weddingEvent.location || "—"}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        👥 {user.weddingEvent.GuestCount || 0} guests
                                                                    </div>
                                                                    {weddingStatus.status !== "Completed" && (
                                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${weddingStatus.color} w-fit`}>
                                                                            {weddingStatus.status}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <div className="text-sm text-gray-500 italic">No event planned</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col space-y-1">
                                                            <div className="text-sm text-gray-900">
                                                                <span className="font-medium">Total Bookings:</span> {user.totalBookings}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center">
                                                                <div className="flex items-center mr-2">
                                                                    {renderStars(user.averageRating || 0)}
                                                                </div>
                                                                {user.averageRating ? user.averageRating.toFixed(1) : '0.0'} ({user.totalReviews} reviews)
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center space-x-2">
                                                            <button
                                                                onClick={() => openDetailsModal(user)}
                                                                className="text-blue-600 hover:text-blue-900 p-3 rounded-lg hover:bg-blue-50 transition-colors shadow-sm border border-blue-200 hover:border-blue-300"
                                                                title="View all details"
                                                            >
                                                                <FaEye className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => openToggleModal(user)}
                                                                className={`p-3 rounded-lg transition-colors shadow-sm border ${user.isActive
                                                                        ? 'text-red-600 hover:text-red-900 hover:bg-red-50 border-red-200 hover:border-red-300'
                                                                        : 'text-green-600 hover:text-green-900 hover:bg-green-50 border-green-200 hover:border-green-300'
                                                                    }`}
                                                                title={user.isActive ? "Disable customer" : "Enable customer"}
                                                            >
                                                                {user.isActive ? (
                                                                    <FaToggleOn className="w-5 h-5" />
                                                                ) : (
                                                                    <FaToggleOff className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(user)}
                                                                className="text-red-600 hover:text-red-900 p-3 rounded-lg hover:bg-red-50 transition-colors shadow-sm border border-red-200 hover:border-red-300"
                                                                title="Delete customer"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Customer Details Modal */}
                {showDetailsModal && selectedUser && (
                    <ViewCustomerModal
                        user={selectedUser}
                        onClose={() => setShowDetailsModal(false)}
                    />
                )}

                {/* Toggle Status Confirmation Modal */}
                <ConfirmModal
                    open={showToggleModal}
                    onClose={() => setShowToggleModal(false)}
                    title={selectedUser?.isActive ? "Disable Customer" : "Enable Customer"}
                    message={`Are you sure you want to ${selectedUser?.isActive ? 'disable' : 'enable'} "${selectedUser?.firstName} ${selectedUser?.lastName}"?`}
                    confirmText={selectedUser?.isActive ? "Disable" : "Enable"}
                    cancelText="Cancel"
                    variant={selectedUser?.isActive ? "danger" : "default"}
                    onConfirm={handleToggleUserStatus}
                />

                {/* Delete Customer Modal */}
                {showDeleteModal && selectedUser && (
                    <DeleteCustomerModal
                        user={selectedUser}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteUser}
                    />
                )}
            </div>
        </AdminMainLayout>
    );
};

export default CustomerManagement;