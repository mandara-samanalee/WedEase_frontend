"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";

interface ServiceCategory {
    id: string;
    categoryName: string;
    description?: string;
    createdAt: string;
}

const ServiceCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<ServiceCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");

    // Mock data - Replace with actual API call
    useEffect(() => {
        const mockCategories: ServiceCategory[] = [
            {
                id: "1",
                categoryName: "Photography",
                description: "Wedding photography and videography services",
                createdAt: "2025-08-15"
            },
            {
                id: "2",
                categoryName: "Catering",
                description: "Food and beverage services for weddings",
                createdAt: "2025-08-16"
            },
            {
                id: "3",
                categoryName: "Decoration",
                description: "Wedding venue decoration and floral arrangements",
                createdAt: "2025-08-17"
            },
            {
                id: "4",
                categoryName: "Music & Entertainment",
                description: "Live bands, DJs, and entertainment services",
                createdAt: "2025-08-18"
            },
            {
                id: "5",
                categoryName: "Transportation",
                description: "Wedding transportation and vehicle rental",
                createdAt: "2025-08-19"
            },
            {
                id: "6",
                categoryName: "Floring",
                description: "",
                createdAt: "2025-08-19"
            },
            {
                id: "7",
                categoryName: "Other",
                description: "Other Wedding related Services",
                createdAt: "2025-08-19"
            }
        ];
        setCategories(mockCategories);
        setFilteredCategories(mockCategories);
    }, []);

    // Filter categories based on search term
    useEffect(() => {
        const filtered = categories.filter(category =>
            category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [categories, searchTerm]);

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        const newCategory: ServiceCategory = {
            id: Date.now().toString(),
            categoryName: newCategoryName.trim(),
            description: newCategoryDescription.trim(),
            createdAt: new Date().toISOString().split('T')[0]
        };

        setCategories(prev => [...prev, newCategory]);
        setNewCategoryName("");
        setNewCategoryDescription("");
        setShowAddModal(false);
        toast.success("Category added successfully");
    };

    const handleEditCategory = () => {
        if (!selectedCategory || !newCategoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        setCategories(prev =>
            prev.map(cat =>
                cat.id === selectedCategory.id
                    ? {
                        ...cat,
                        categoryName: newCategoryName.trim(),
                        description: newCategoryDescription.trim()
                    }
                    : cat
            )
        );

        setShowEditModal(false);
        setSelectedCategory(null);
        setNewCategoryName("");
        setNewCategoryDescription("");
        toast.success("Category updated successfully");
    };

    const handleDeleteCategory = () => {
        if (!selectedCategory) return;

        setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
        setShowDeleteModal(false);
        setSelectedCategory(null);
        toast.success("Category deleted successfully");
    };

    const openEditModal = (category: ServiceCategory) => {
        setSelectedCategory(category);
        setNewCategoryName(category.categoryName);
        setNewCategoryDescription(category.description || "");
        setShowEditModal(true);
    };

    const openDeleteModal = (category: ServiceCategory) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    return (
        <AdminMainLayout>
            <div className="max-w-5xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                            Service Categories
                        </h1>
                    </div>
                    <DefaultButton
                        btnLabel="Add Category"
                        Icon={<FaPlus className="w-4 h-4" />}
                        className="w-[180px] inline-flex items-center gap-2 px-4 py-2"
                        handleClick={() => setShowAddModal(true)}
                    />
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-purple-50 border-b border-purple-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-purple-800 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            {searchTerm ? "No categories found matching your search" : "No categories available"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{category.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.categoryName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate">
                                                    {category.description || "No description"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(category)}
                                                        className="text-purple-600 hover:text-purple-900 p-2 rounded-md hover:bg-purple-50 transition-colors"
                                                        title="Edit category"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(category)}
                                                        className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                                                        title="Delete category"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Category Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        placeholder="Enter category name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        placeholder="Enter category description"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewCategoryName("");
                                        setNewCategoryDescription("");
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Category Modal */}
                {showEditModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Edit Category</h3>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedCategory(null);
                                        setNewCategoryName("");
                                        setNewCategoryDescription("");
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditCategory}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Update Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${selectedCategory?.categoryName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    onConfirm={handleDeleteCategory}
                />
            </div>
        </AdminMainLayout>
    );
};

export default ServiceCategoryPage;