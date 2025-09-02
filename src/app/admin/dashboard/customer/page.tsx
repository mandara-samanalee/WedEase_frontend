"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import { FaEye, FaToggleOn, FaToggleOff, FaSearch, FaTrash, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";

interface BookedService {
    serviceId: string;
    serviceName: string;
    category: string;
    bookingDate: string;
    price: number;
}

interface UserFeedback {
    id: string;
    vendorId: string;
    vendorName: string;
    category: string;
    rating: number;
    reviewText: string;
    bookingDate: string;
    createdAt: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    isActive: boolean;
    joinDate: string;
    lastLogin: string;
    // Wedding Information
    weddingDate: string;
    partnerName: string;
    venue: string;
    guestCount: number;
    // Activity & Spending
    totalBookings: number;
    totalSpent: number;
    // Enhanced Analytics
    bookedServices: BookedService[];
    userFeedback: UserFeedback[];
    averageRating: number;
    totalReviews: number;
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

    // Mock data with booked services (replaced booked vendors)
    useEffect(() => {
        const mockUsers: User[] = [
            {
                id: "CUS00002",
                firstName: "Alice",
                lastName: "Johnson",
                email: "alice@email.com",
                contactNo: "+94771234567",
                isActive: true,
                joinDate: "2024-01-15",
                lastLogin: "2024-09-01",
                // Wedding Information
                weddingDate: "2024-12-15",
                partnerName: "Michael Johnson",
                venue: "Cinnamon Grand Colombo",
                guestCount: 150,
                // Activity & Spending
                totalBookings: 8,
                totalSpent: 1850000,
                // Enhanced Analytics (booked services)
                bookedServices: [
                    { serviceId: "S001", serviceName: "Wedding Photography Premium", category: "Photography", bookingDate: "2024-08-15", price: 200000 },
                    { serviceId: "S010", serviceName: "Full Wedding Planning", category: "Wedding Planning", bookingDate: "2024-07-20", price: 800000 },
                    { serviceId: "S020", serviceName: "Venue Decoration - Elite", category: "Decoration", bookingDate: "2024-08-25", price: 150000 },
                    { serviceId: "S031", serviceName: "Catering - Royal Menu", category: "Catering", bookingDate: "2024-08-10", price: 400000 }
                ],
                userFeedback: [
                    {
                        id: "F001",
                        vendorId: "V001",
                        vendorName: "John's Photography Studio",
                        category: "Photography",
                        rating: 5,
                        reviewText: "Absolutely amazing work! The photos came out perfectly and captured every moment beautifully.",
                        bookingDate: "2024-08-15",
                        createdAt: "2024-08-20"
                    },
                    {
                        id: "F002",
                        vendorId: "V002",
                        vendorName: "Sarah's Event Planning",
                        category: "Wedding Planning",
                        rating: 4,
                        reviewText: "Great service and attention to detail. Made our wedding planning stress-free.",
                        bookingDate: "2024-07-20",
                        createdAt: "2024-07-25"
                    },
                    {
                        id: "F003",
                        vendorId: "V003",
                        vendorName: "Elite Decorations",
                        category: "Decoration",
                        rating: 5,
                        reviewText: "The decoration was stunning! Exceeded our expectations completely.",
                        bookingDate: "2024-08-25",
                        createdAt: "2024-08-30"
                    }
                ],
                averageRating: 4.7,
                totalReviews: 3
            },
            {
                id: "CUS00003",
                firstName: "Bob",
                lastName: "Smith",
                email: "bob@email.com",
                contactNo: "+94777654321",
                isActive: true,
                joinDate: "2024-02-20",
                lastLogin: "2024-08-30",
                // Wedding Information
                weddingDate: "2024-11-22",
                partnerName: "Emma Smith",
                venue: "Shangri-La Colombo",
                guestCount: 200,
                // Activity & Spending
                totalBookings: 12,
                totalSpent: 2750000,
                // Enhanced Analytics (booked services)
                bookedServices: [
                    { serviceId: "S101", serviceName: "Corporate-style Catering", category: "Catering", bookingDate: "2024-08-28", price: 600000 },
                    { serviceId: "S110", serviceName: "Sound & Light Package", category: "Music & Entertainment", bookingDate: "2024-08-20", price: 300000 },
                    { serviceId: "S130", serviceName: "Luxury Transportation - Shuttle", category: "Transportation", bookingDate: "2024-08-15", price: 350000 },
                    { serviceId: "S140", serviceName: "Dream Photography - Deluxe", category: "Photography", bookingDate: "2024-08-25", price: 350000 }
                ],
                userFeedback: [
                    {
                        id: "F004",
                        vendorId: "V005",
                        vendorName: "Mike's Catering Services",
                        category: "Catering",
                        rating: 4,
                        reviewText: "Food quality was excellent. Professional service throughout the event.",
                        bookingDate: "2024-08-28",
                        createdAt: "2024-09-01"
                    },
                    {
                        id: "F005",
                        vendorId: "V006",
                        vendorName: "Sound & Light Pro",
                        category: "Music & Entertainment",
                        rating: 5,
                        reviewText: "Amazing sound system and lighting effects. Made our reception memorable!",
                        bookingDate: "2024-08-20",
                        createdAt: "2024-08-22"
                    }
                ],
                averageRating: 4.5,
                totalReviews: 2
            },
            {
                id: "CUS00004",
                firstName: "Sarah",
                lastName: "Williams",
                email: "sarah.williams@email.com",
                contactNo: "+94712345678",
                isActive: true,
                joinDate: "2024-03-10",
                lastLogin: "2024-09-02",
                weddingDate: "2025-01-20",
                partnerName: "David Williams",
                venue: "Galle Face Hotel",
                guestCount: 120,
                totalBookings: 6,
                totalSpent: 1200000,
                bookedServices: [
                    { serviceId: "S201", serviceName: "Bridal Makeup Deluxe", category: "Beauty", bookingDate: "2024-08-05", price: 80000 },
                    { serviceId: "S211", serviceName: "Wedding Videography", category: "Photography", bookingDate: "2024-08-12", price: 250000 },
                    { serviceId: "S221", serviceName: "Floral Arrangements Premium", category: "Decoration", bookingDate: "2024-08-18", price: 120000 }
                ],
                userFeedback: [
                    {
                        id: "F006",
                        vendorId: "V007",
                        vendorName: "Beauty Bliss Studio",
                        category: "Beauty",
                        rating: 5,
                        reviewText: "Absolutely stunning makeup! Made me feel like a princess on my special day.",
                        bookingDate: "2024-08-05",
                        createdAt: "2024-08-08"
                    }
                ],
                averageRating: 5.0,
                totalReviews: 1
            },
            {
                id: "CUS00005",
                firstName: "Michael",
                lastName: "Brown",
                email: "michael.brown@email.com",
                contactNo: "+94756789012",
                isActive: false,
                joinDate: "2023-12-15",
                lastLogin: "2024-07-20",
                weddingDate: "2024-10-05",
                partnerName: "Lisa Brown",
                venue: "Hilton Colombo",
                guestCount: 180,
                totalBookings: 15,
                totalSpent: 3200000,
                bookedServices: [
                    { serviceId: "S301", serviceName: "Grand Catering Package", category: "Catering", bookingDate: "2024-07-10", price: 800000 },
                    { serviceId: "S311", serviceName: "Wedding Coordination Premium", category: "Wedding Planning", bookingDate: "2024-06-15", price: 500000 },
                    { serviceId: "S321", serviceName: "Live Band Performance", category: "Music & Entertainment", bookingDate: "2024-07-22", price: 400000 },
                    { serviceId: "S331", serviceName: "Luxury Car Rental", category: "Transportation", bookingDate: "2024-07-25", price: 150000 }
                ],
                userFeedback: [
                    {
                        id: "F007",
                        vendorId: "V008",
                        vendorName: "Elite Catering Co.",
                        category: "Catering",
                        rating: 4,
                        reviewText: "Great food quality and professional service. Guests loved the menu variety.",
                        bookingDate: "2024-07-10",
                        createdAt: "2024-07-15"
                    },
                    {
                        id: "F008",
                        vendorId: "V009",
                        vendorName: "Dream Wedding Planners",
                        category: "Wedding Planning",
                        rating: 5,
                        reviewText: "Exceptional planning and execution. Everything went perfectly according to plan.",
                        bookingDate: "2024-06-15",
                        createdAt: "2024-06-20"
                    }
                ],
                averageRating: 4.5,
                totalReviews: 2
            },
            {
                id: "CUS00006",
                firstName: "Emma",
                lastName: "Davis",
                email: "emma.davis@email.com",
                contactNo: "+94723456789",
                isActive: true,
                joinDate: "2024-04-20",
                lastLogin: "2024-09-01",
                weddingDate: "2025-03-15",
                partnerName: "James Davis",
                venue: "Mount Lavinia Hotel",
                guestCount: 90,
                totalBookings: 4,
                totalSpent: 950000,
                bookedServices: [
                    { serviceId: "S401", serviceName: "Beach Wedding Setup", category: "Decoration", bookingDate: "2024-08-30", price: 200000 },
                    { serviceId: "S411", serviceName: "Intimate Photography Package", category: "Photography", bookingDate: "2024-08-28", price: 180000 }
                ],
                userFeedback: [
                    {
                        id: "F009",
                        vendorId: "V010",
                        vendorName: "Coastal Decorations",
                        category: "Decoration",
                        rating: 4,
                        reviewText: "Beautiful beach setup with amazing attention to detail. Perfect for our intimate wedding.",
                        bookingDate: "2024-08-30",
                        createdAt: "2024-09-02"
                    }
                ],
                averageRating: 4.0,
                totalReviews: 1
            },
            {
                id: "CUS00007",
                firstName: "John",
                lastName: "Wilson",
                email: "john.wilson@email.com",
                contactNo: "+94734567890",
                isActive: true,
                joinDate: "2024-01-08",
                lastLogin: "2024-08-31",
                weddingDate: "2024-11-10",
                partnerName: "Rachel Wilson",
                venue: "Kingsbury Hotel",
                guestCount: 220,
                totalBookings: 10,
                totalSpent: 2100000,
                bookedServices: [
                    { serviceId: "S501", serviceName: "Full Venue Decoration", category: "Decoration", bookingDate: "2024-08-20", price: 300000 },
                    { serviceId: "S511", serviceName: "Traditional Catering", category: "Catering", bookingDate: "2024-08-15", price: 650000 },
                    { serviceId: "S521", serviceName: "DJ & Sound System", category: "Music & Entertainment", bookingDate: "2024-08-25", price: 180000 },
                    { serviceId: "S531", serviceName: "Wedding Photography & Video", category: "Photography", bookingDate: "2024-08-10", price: 420000 }
                ],
                userFeedback: [
                    {
                        id: "F010",
                        vendorId: "V011",
                        vendorName: "Elegant Events",
                        category: "Decoration",
                        rating: 5,
                        reviewText: "Transformed our venue into a magical wonderland. Exceeded all expectations!",
                        bookingDate: "2024-08-20",
                        createdAt: "2024-08-23"
                    },
                    {
                        id: "F011",
                        vendorId: "V012",
                        vendorName: "Spice Garden Catering",
                        category: "Catering",
                        rating: 4,
                        reviewText: "Authentic traditional cuisine that impressed all our guests. Great service too.",
                        bookingDate: "2024-08-15",
                        createdAt: "2024-08-18"
                    }
                ],
                averageRating: 4.5,
                totalReviews: 2
            },
            {
                id: "CUS00008",
                firstName: "Priya",
                lastName: "Fernando",
                email: "priya.fernando@email.com",
                contactNo: "+94745678901",
                isActive: true,
                joinDate: "2024-05-12",
                lastLogin: "2024-09-02",
                weddingDate: "2025-02-14",
                partnerName: "Arjun Fernando",
                venue: "Jetwing Colombo Seven",
                guestCount: 160,
                totalBookings: 7,
                totalSpent: 1680000,
                bookedServices: [
                    { serviceId: "S601", serviceName: "Fusion Wedding Planning", category: "Wedding Planning", bookingDate: "2024-08-22", price: 450000 },
                    { serviceId: "S611", serviceName: "Henna & Beauty Services", category: "Beauty", bookingDate: "2024-08-26", price: 120000 },
                    { serviceId: "S621", serviceName: "Cultural Dance Performance", category: "Music & Entertainment", bookingDate: "2024-08-28", price: 250000 }
                ],
                userFeedback: [
                    {
                        id: "F012",
                        vendorId: "V013",
                        vendorName: "Fusion Weddings Lanka",
                        category: "Wedding Planning",
                        rating: 5,
                        reviewText: "Perfect blend of traditional and modern elements. Truly understood our vision.",
                        bookingDate: "2024-08-22",
                        createdAt: "2024-08-25"
                    }
                ],
                averageRating: 5.0,
                totalReviews: 1
            },
            {
                id: "CUS00009",
                firstName: "Daniel",
                lastName: "Thompson",
                email: "daniel.thompson@email.com",
                contactNo: "+94756789123",
                isActive: false,
                joinDate: "2023-11-30",
                lastLogin: "2024-06-15",
                weddingDate: "2024-09-28",
                partnerName: "Anna Thompson",
                venue: "Waters Edge",
                guestCount: 140,
                totalBookings: 9,
                totalSpent: 1950000,
                bookedServices: [
                    { serviceId: "S701", serviceName: "Lakeside Wedding Setup", category: "Decoration", bookingDate: "2024-06-10", price: 280000 },
                    { serviceId: "S711", serviceName: "Premium Catering Menu", category: "Catering", bookingDate: "2024-06-05", price: 580000 },
                    { serviceId: "S721", serviceName: "Wedding Cake Design", category: "Catering", bookingDate: "2024-06-12", price: 85000 }
                ],
                userFeedback: [
                    {
                        id: "F013",
                        vendorId: "V014",
                        vendorName: "Lakeside Events",
                        category: "Decoration",
                        rating: 3,
                        reviewText: "Decent setup but some elements didn't match our expectations. Communication could be better.",
                        bookingDate: "2024-06-10",
                        createdAt: "2024-06-15"
                    }
                ],
                averageRating: 3.0,
                totalReviews: 1
            }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
    }, []);

    // Filter users based on search term and status
    useEffect(() => {
        let filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.venue.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter !== "all") {
            filtered = filtered.filter(user =>
                statusFilter === "active" ? user.isActive : !user.isActive
            );
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, statusFilter]);

    const handleToggleUserStatus = () => {
        if (!selectedUser) return;

        setUsers(prev =>
            prev.map(user =>
                user.id === selectedUser.id
                    ? { ...user, isActive: !user.isActive }
                    : user
            )
        );

        const action = selectedUser.isActive ? "disabled" : "enabled";
        toast.success(`Customer ${action} successfully`);
        setShowToggleModal(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;

        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        toast.success("Customer deleted successfully");
        setShowDeleteModal(false);
        setSelectedUser(null);
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

    const formatCurrency = (amount: number) => {
        return `LKR ${amount.toLocaleString()}`;
    };

    const getWeddingStatus = (weddingDate: string) => {
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
                            placeholder="Search customers, partners, venues..."
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
                                        const weddingStatus = getWeddingStatus(user.weddingDate);
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                        <div className="text-sm text-gray-500">{user.contactNo}</div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Joined: {new Date(user.joinDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.partnerName}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            📅 {new Date(user.weddingDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            📍 {user.venue}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            👥 {user.guestCount} guests
                                                        </div>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${weddingStatus.color} w-fit`}>
                                                            {weddingStatus.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="text-sm text-gray-900">
                                                            <span className="font-medium">Bookings:</span> {user.totalBookings}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            <span className="font-medium">Booked Services:</span> {user.bookedServices.length}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <div className="flex items-center mr-2">
                                                                {renderStars(user.averageRating)}
                                                            </div>
                                                            {user.averageRating.toFixed(1)} ({user.totalReviews} reviews)
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
                </div>

                {/* Enhanced Customer Details Modal (updated: shows booked services) */}
                {showDetailsModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                                <h3 className="text-xl font-semibold text-gray-900">Customer Profile & Analytics</h3>
                                <p className="text-sm text-gray-500">{selectedUser.firstName} {selectedUser.lastName} - {selectedUser.id}</p>
                            </div>

                            <div className="px-6 py-6 space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <p className="text-sm text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="text-sm text-gray-900">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Contact</label>
                                            <p className="text-sm text-gray-900">{selectedUser.contactNo}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Join Date</label>
                                            <p className="text-sm text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Login</label>
                                            <p className="text-sm text-gray-900">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedUser.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedUser.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wedding Information (budget removed) */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Wedding Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Partner Name</label>
                                                <p className="text-sm text-gray-900 font-medium">{selectedUser.partnerName}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                                                <p className="text-sm text-gray-900">{new Date(selectedUser.weddingDate).toLocaleDateString()}</p>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getWeddingStatus(selectedUser.weddingDate).color}`}>
                                                    {getWeddingStatus(selectedUser.weddingDate).status}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Venue</label>
                                                <p className="text-sm text-gray-900">{selectedUser.venue}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Guest Count</label>
                                                <p className="text-lg font-semibold text-purple-600">{selectedUser.guestCount} guests</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Summary</label>
                                                <p className="text-sm text-gray-600">Total bookings: {selectedUser.totalBookings} — Total spent: {formatCurrency(selectedUser.totalSpent)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booked Services (replaces booked vendors) */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Booked Services</h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {selectedUser.bookedServices.map((svc, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900">{svc.serviceName}</h5>
                                                        <p className="text-sm text-purple-600">{svc.category}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-purple-600">
                                                        {formatCurrency(svc.price)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Booking Date: {new Date(svc.bookingDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Feedback & Ratings */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Feedback & Ratings</h4>
                                    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                                {selectedUser.averageRating.toFixed(1)}
                                            </div>
                                            <div className="flex justify-center mb-1">
                                                {renderStars(selectedUser.averageRating)}
                                            </div>
                                            <div className="text-sm text-gray-600">Average Rating</div>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                                {selectedUser.totalReviews}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Reviews</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600 mb-1">
                                                {selectedUser.totalReviews > 0 ? ((selectedUser.totalReviews / Math.max(selectedUser.totalBookings, 1)) * 100).toFixed(0) : '0'}%
                                            </div>
                                            <div className="text-sm text-gray-600">Review Rate</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedUser.userFeedback.map((feedback, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900">{feedback.vendorName}</h5>
                                                        <p className="text-sm text-purple-600">{feedback.category}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="flex items-center mr-2">
                                                            {renderStars(feedback.rating)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-gray-700">{feedback.rating}/5</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-3 italic">&quot;{feedback.reviewText}&quot;</p>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Booking: {new Date(feedback.bookingDate).toLocaleDateString()}</span>
                                                    <span>Review: {new Date(feedback.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                    title={selectedUser?.isActive ? "Disable Customer" : "Enable Customer"}
                    message={`Are you sure you want to ${selectedUser?.isActive ? 'disable' : 'enable'} "${selectedUser?.firstName} ${selectedUser?.lastName}"?`}
                    confirmText={selectedUser?.isActive ? "Disable" : "Enable"}
                    cancelText="Cancel"
                    variant={selectedUser?.isActive ? "danger" : "default"}
                    onConfirm={handleToggleUserStatus}
                />

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Customer"
                    message={`Are you sure you want to permanently delete "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteUser}
                />
            </div>
        </AdminMainLayout>
    );
};
export default CustomerManagement;