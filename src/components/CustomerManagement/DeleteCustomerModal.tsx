import React, { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

interface User {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
}

interface Props {
    user: User;
    onClose: () => void;
    onConfirm: (userId: string) => Promise<void>;
}

const DeleteCustomerModal: React.FC<Props> = ({ user, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);
    const fullName = `${user.firstName} ${user.lastName}`;

    const handleConfirm = async () => {
        if (confirmText !== fullName) {
            toast.error("Please enter the full name exactly to confirm deletion.");
            return;
        }
        setLoading(true);
        try {
            await onConfirm(user.userId);
        } catch (err) {
            console.error(err);
            // Error toast is handled in parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FaExclamationTriangle className="text-red-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-900">Delete Customer</h3>
                            <p className="text-sm text-red-700">This action cannot be undone</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-4">
                    <p className="text-sm text-gray-800">
                        You are about to permanently delete the account for <span className="font-bold">{fullName}</span>.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            The following will be deleted: account, bookings, reviews and related data.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-900 mb-2">
                            Please type <span className="font-mono bg-gray-200 px-2 py-1 rounded text-red-600">{fullName}</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Enter full name to confirm"
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:bg-gray-100"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                    <button 
                        onClick={onClose} 
                        disabled={loading} 
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={confirmText !== fullName || loading} 
                        className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${
                            confirmText === fullName && !loading 
                                ? 'bg-red-600 hover:bg-red-700' 
                                : 'bg-gray-300 cursor-not-allowed'
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

export default DeleteCustomerModal;