"use client";

import React, { useState, useEffect } from "react";
import DefaultButton from "@/components/DefaultButton";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
    saving?: boolean;
    initialName?: string;
    initialDescription?: string;
}

const EditCategoryModal: React.FC<Props> = ({ isOpen, onClose, onSave, saving = false, initialName = "", initialDescription = "" }) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setDescription(initialDescription);
        }
    }, [isOpen, initialName, initialDescription]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Category</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <DefaultButton
                        btnLabel="Cancel"
                        handleClick={() => { setName(initialName); setDescription(initialDescription); onClose(); }}
                        className="!bg-white !text-gray-700 border border-gray-300 rounded-lg hover:!bg-gray-50"
                    />
                    <DefaultButton
                        btnLabel={saving ? "Updating..." : "Update Category"}
                        handleClick={() => onSave(name.trim(), description.trim())}
                        className="!bg-purple-600 !text-white rounded-lg hover:!bg-purple-700"
                    />
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;