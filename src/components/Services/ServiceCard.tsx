import React, { useState } from "react";
import { FaEye, FaStar, FaMapMarkerAlt, FaUsers, FaTrash } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import { Service } from "./Types";
import ConfirmDisableModal from "./ConfirmDisableModal";
import ConfirmModal from "@/utils/confirmationModel";
import toast from "react-hot-toast";

interface Props {
  service: Service;
  openDetailsModal: (s: Service) => void;
  onDeleteSuccess: (serviceId: string) => void;
  toggleServiceStatus: (id: string) => void;
}

const ServiceCard: React.FC<Props> = ({ service, openDetailsModal, onDeleteSuccess, toggleServiceStatus }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleToggleStatusClick = () => {
    setShowStatusModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

    setLoadingDelete(true);
    try {
      const res = await fetch(`${BASE_URL}/service/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId: service.id,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Failed to delete service:", res.status, text);
        toast.error("Failed to delete service");
        setLoadingDelete(false);
        setShowDeleteModal(false);
        return;
      }

      toast.success("Service deleted successfully");
      onDeleteSuccess(service.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Network error deleting service:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const confirmStatusChange = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const newIsActive = !service.isActive;

    setLoadingToggle(true);
    try {
      const res = await fetch(`${BASE_URL}/service/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId: service.id,
          isActive: newIsActive,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Failed to update service status:", res.status, text);
        toast.error("Failed to update service status");
        setLoadingToggle(false);
        setShowStatusModal(false);
        return;
      }

      toggleServiceStatus(service.id);
      toast.success(`Service ${newIsActive ? "activated" : "deactivated"} successfully`);
      setShowStatusModal(false);
    } catch (error) {
      console.error("Network error updating service status:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingToggle(false);
    }
  };

  const statusLabel = service.isActive ? "Enabled" : "Disabled";
  const cardStateClasses = service.isActive ? "" : "opacity-80 filter grayscale";
  const toggleButtonLabel = service.isActive ? 'Deactivate Service' : 'Activate Service';

  return (
    <>
      <div className={`mt-6 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${cardStateClasses}`}>
        <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
          {service.photos && service.photos.length > 0 ? (
            <img
              src={service.photos[0]}
              alt={service.serviceName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GiDiamondRing className="text-6xl text-white/80" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusLabel}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 px-2 py-1 rounded-lg text-xs font-semibold text-purple-700">
              {service.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
            {service.serviceName}
          </h3>

          <div className="mb-3">
            <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md border border-purple-200 inline-block">
            Service ID: {service.serviceId}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description || "No description available"}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 w-4 h-4" />
              <span className="text-sm">
                {service.rating?.toFixed(1) || '0.0'} ({service.totalReviews || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-purple-500 w-4 h-4" />
              <span className="text-sm">{service.bookingCount || 0} bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400 w-4 h-4" />
              <span className="text-sm">{service.location?.city || service.location?.district || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {service.packages?.length || 0} packages
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-purple-700">
              {service.packages && service.packages.length > 0
                ? `LKR ${Math.min(...service.packages.map(p => parseInt(p.price) || 0)).toLocaleString()}`
                : 'Price on request'
              }
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => openDetailsModal(service)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium shadow-md"
              >
                <FaEye className="w-4 h-4" />
                View Details
              </button>

              <button
                onClick={handleDeleteClick}
                disabled={loadingDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center shadow-md disabled:opacity-50"
                title="Delete Service"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleToggleStatusClick}
              disabled={loadingToggle || loadingDelete}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${service.isActive
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50'
                }`}
            >
              {toggleButtonLabel}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDisableModal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={confirmStatusChange}
        serviceName={service.serviceName}
        targetState={service.isActive ? "inactive" : "active"}
      />

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={
          <div>
            <p className="mb-2">
              Are you sure you want to permanently delete <strong className="text-gray-900">&quot;{service.serviceName}&quot;</strong>?
            </p>
            <p className="text-red-600 font-medium">This action cannot be undone.</p>
          </div>
        }
        confirmText={loadingDelete ? "Deleting..." : "Delete Permanently"}
        cancelText="Cancel"
        variant="danger"
        disableOutsideClose={loadingDelete}
      />
    </>
  );
};

export default ServiceCard;