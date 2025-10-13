/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import AdminMainLayout from "@/components/AdminLayout/AdminMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmModal from "@/utils/confirmationModel";
import AddCategoryModal from '@/components/Category/AddCategoryModel'
import EditCategoryModal from "@/components/Category/EditCategoryModel";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    const [, setNewCategoryName] = useState("");
    const [, setNewCategoryDescription] = useState("");

    // fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/category/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    //"Authorization": `Bearer ${token}`,
                }
            });
            const json = await response.json();

            const raw = json?.data ?? [];
            const mapped: ServiceCategory[] = raw.map((c: any) => ({
                id: c.id ?? c._id,
                categoryName: c.name,
                description: c.description ?? "",
                createdAt: c.createdAt ? c.createdAt.split("T")[0] : "",
            }));
            setCategories(mapped);
            setFilteredCategories(mapped);
        } catch (err) {
            console.error("Failed to load categories", err);
            toast.error("Failed to load categories");
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);


    // Filter categories based on search term
    useEffect(() => {
        const filtered = categories.filter(category =>
            category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [categories, searchTerm]);


    // add new category
    const addCategory = async (name: string, description: string) => {
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const body = { name: name.trim(), description: description.trim() };
            const res = await fetch(`${BASE_URL}/category/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    //"Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.message ?? "Failed to add category");
            }

            toast.success("Category added successfully");
            setShowAddModal(false);
            // refresh list from server
            fetchCategories();
        } catch (error) {
            console.error("Add category error", error);
            toast.error("Failed to add category");
        }
    };


    // edit category
    const editCategory = async (name: string, description: string) => {
        if (!selectedCategory) return;
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            const body = { name: name.trim(), description: description.trim() };
            const res = await fetch(`${BASE_URL}/category/update/${selectedCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    //"Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.message ?? "Failed to update category");
            }

            toast.success("Category updated successfully");
            setShowEditModal(false);
            setSelectedCategory(null);
            setNewCategoryName("");
            setNewCategoryDescription("");
            // refresh list
            await fetchCategories();
        } catch (error) {
            console.error("Update category error", error);
            toast.error("Failed to update category");
        }
    };

    // delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            const res = await fetch(`${BASE_URL}/category/delete/${selectedCategory.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.message ?? "Failed to delete category");
            }

            toast.success("Category deleted successfully");
            setShowDeleteModal(false);
            setSelectedCategory(null);
            // refresh list
            await fetchCategories();
        } catch (error) {
            console.error("Delete category error", error);
            toast.error("Failed to delete category");
        }
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
                <AddCategoryModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={addCategory}
                />

                {/* Edit Category Modal */}
                {selectedCategory && (
                    <EditCategoryModal
                        isOpen={showEditModal}
                        onClose={() => { setShowEditModal(false); setSelectedCategory(null); }}
                        onSave={editCategory}
                        initialName={selectedCategory.categoryName}
                        initialDescription={selectedCategory.description}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${selectedCategory?.categoryName}"? This action cannot be undone.`}
                    onConfirm={handleDeleteCategory}
                />
            </div>
        </AdminMainLayout>
    );
};

export default ServiceCategoryPage;