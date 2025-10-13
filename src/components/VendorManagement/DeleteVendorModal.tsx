import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteVendorModalProps {
    vendor: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        services: Array<{
            id: string;
            serviceName: string;
            category: string;
        }>;
    };
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteVendorModal: React.FC<DeleteVendorModalProps> = ({ vendor, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);
    
    const vendorFullName = `${vendor.firstName} ${vendor.lastName}`;
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleConfirm = async () => {
        if (confirmText !== vendorFullName) {
            toast.error('Please enter the vendor name exactly as shown to confirm deletion.');
            return;
        }

        if (!BASE_URL) {
            toast.error("Backend URL not configured");
            return;
        }

        const raw = localStorage.getItem("user");
        if (!raw) {
            toast.error("Not authenticated");
            return;
        }

        let token: string | undefined;
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
            setLoading(true);
            const response = await fetch(`${BASE_URL}/vendor/delete-account/${vendor.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message || "Vendor deleted successfully");
                onConfirm();
            } else {
                toast.error(result.message || "Failed to delete vendor");
            }
        } catch (error) {
            console.error("Error deleting vendor:", error);
            toast.error("An error occurred while deleting the vendor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-red-900">Delete Vendor Account</h3>
                            <p className="text-sm text-red-700">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-6">
                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-medium">
                            You are about to permanently delete the vendor account for{" "}
                            <span className="font-bold">{vendorFullName}</span>. This action is irreversible.
                        </p>
                    </div>

                    {/* Data Loss Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-900 mb-3 text-sm flex items-center gap-2">
                            <FaExclamationTriangle className="w-4 h-4" />
                            The following data will be permanently deleted:
                        </h5>
                        <ul className="text-sm text-yellow-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>Vendor account and profile information</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>
                                    All <span className="font-semibold">{vendor.services.length}</span> service
                                    {vendor.services.length !== 1 ? 's' : ''} and their details
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>Service photos and media files</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>Customer reviews and ratings</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-0.5">•</span>
                                <span>Booking history and records</span>
                            </li>
                        </ul>
                    </div>

                    {/* Confirmation Input */}
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                            Please type{" "}
                            <span className="font-mono bg-gray-200 px-2 py-1 rounded text-red-600">
                                {vendorFullName}
                            </span>{" "}
                            to confirm:
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Enter vendor name to confirm"
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={confirmText !== vendorFullName || loading}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                            confirmText === vendorFullName && !loading
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading && <Loader className="animate-spin w-4 h-4" />}
                        Confirm deletion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteVendorModal;