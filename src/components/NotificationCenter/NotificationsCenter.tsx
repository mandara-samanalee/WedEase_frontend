'use client';
import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { Loader } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    bookingId?: string;
}

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>('');
    const [markingAllRead, setMarkingAllRead] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Get userId from localStorage
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                const id = parsed.userId || parsed.user?.userId || '';
                setUserId(id);
            }
        } catch (error) {
            console.error("Error loading user:", error);
            setError("Failed to load user information");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const response = await fetch(`${BASE_URL}/notification/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setNotifications(result.data || []);
            } else {
                setError(result.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Failed to load notifications. Please try again.');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            setMarkingAllRead(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${BASE_URL}/notification/read-all/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
            } else {
                setError(result.message || 'Failed to mark notifications as read');
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
            setError('Failed to mark all as read. Please try again.');
        } finally {
            setMarkingAllRead(false);
        }
    };

    const getNotificationIcon = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('confirmed') || lowerTitle.includes('approved')) {
            return <FaCheckCircle className="text-green-500 text-xl" />;
        } else if (lowerTitle.includes('pending') || lowerTitle.includes('created')) {
            return <FaExclamationCircle className="text-yellow-500 text-xl" />;
        } else if (lowerTitle.includes('cancelled') || lowerTitle.includes('rejected')) {
            return <FaExclamationCircle className="text-red-500 text-xl" />;
        }
        return <FaInfoCircle className="text-blue-500 text-xl" />;
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin w-14 h-14 text-purple-600 mx-auto" />
            </div>
        );
    }

    return (
        <div className="max-w-full mr-24 pb-24">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">Notification Center</h1>
                </div>
                <p className="text-gray-600">Stay updated with your bookings</p>
            </div>

            {/* Error Message */}
            {error && (
                    <p className="font-medium">{error}</p>
            )}

            {/* Filter and Actions */}
            <div className="bg-white rounded-xl shadow-md border border-purple-100 p-5 mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${filter === 'all'
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-300'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                }`}
                        >
                            All <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">{notifications.length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${filter === 'unread'
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-300'
                                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                }`}
                        >
                            Unread <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">{unreadCount}</span>
                        </button>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            disabled={markingAllRead}
                            className="px-5 py-2.5 text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                            <FaCheckCircle />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md border border-purple-100 p-16 text-center">
                        <div className="inline-block p-6 bg-purple-50 rounded-full mb-4">
                            <FaBell className="text-6xl text-purple-300" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No notifications to display</p>
                        <p className="text-gray-400 text-sm mt-2">You&apos;re all caught up!</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`rounded-xl shadow-md border transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${notification.isRead
                                    ? 'bg-white border-gray-200'
                                    : 'bg-gradient-to-r from-purple-50 via-purple-50/70 to-pink-50 border-purple-300 shadow-purple-100'
                                }`}
                        >
                            <div className="p-3">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.title)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                                                {notification.title}
                                                {!notification.isRead && (
                                                    <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                                                )}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2 leading-snug">{notification.message}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTimestamp(notification.createdAt)}
                                            </span>
                                            {notification.bookingId && (
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-semibold">
                                                    Booking: {notification.bookingId.slice(-8)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}