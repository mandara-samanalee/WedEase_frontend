import React, { useState } from "react";
import { FaEdit, FaEye, FaStar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { GiDiamondRing } from "react-icons/gi";
import { Service } from "./Types";
import ConfirmDisableModal from "./ConfirmDisableModal";
import toast from "react-hot-toast";

interface Props {
  service: Service;
  openDetailsModal: (s: Service) => void;
  handleEditService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
}

const ServiceCard: React.FC<Props> = ({ service, openDetailsModal, handleEditService, toggleServiceStatus }) => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [loadingToggle, setLoadingToggle] = useState(false);

  const handleDisableClick = () => {
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = async () => {

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

    const newIsActive = !service.isActive; 

    setLoadingToggle(true);
    try {
      const res = await fetch(`${BASE_URL}/service/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { 
            Authorization: `Bearer ${token}` } : {}),
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
      } else {
        toggleServiceStatus(service.id);
        toast.success(`Service ${newIsActive ? "activated" : "deactivated"} successfully`);
      }
    } catch (error) {
      console.error("Network error updating service status:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoadingToggle(false);
      setShowDeactivateModal(false);
    }
  };

  // show clear labels 
  const statusLabel = service.isActive ? "Enabled" : "Disabled";
  const cardStateClasses = service.isActive ? "" : "opacity-80 filter grayscale";

  return (
    <>
      <div className={`mt-6 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${cardStateClasses}`}>
        <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400">
          {/* Show first photo if available, otherwise show default icon */}
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

          <div className="flex gap-2">
            <button
              onClick={() => openDetailsModal(service)}
              className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              aria-label="View service"
            >
              <FaEye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => handleEditService(service.id)}
              className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              aria-label="Edit service"
            >
              <FaEdit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDisableClick}
              className={`px-4 py-2 rounded-lg transition-colors ${service.isActive ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              disabled={loadingToggle}
              aria-pressed={!service.isActive}
              aria-label={service.isActive ? "Disable service" : "Enable service"}
            >
              {service.isActive ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDisableModal
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={confirmDeactivate}
        serviceName={service.serviceName}
        targetState={service.isActive ? "inactive" : "active"}
      />
    </>
  );
};

export default ServiceCard;
