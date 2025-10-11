import React from "react";
import { X, User, Mail, Phone, MapPin, Calendar, Users, Package, Image as ImageIcon } from "lucide-react";
import { BookingRequest } from "./Types";

interface Props {
  open: boolean;
  booking: BookingRequest | null;
  onClose: () => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStatusStyles = (status?: string) => {
  if (!status) return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
  
  switch (status.toLowerCase()) {
    case "pending":
      return { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" };
    case "confirmed":
      return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" };
    case "completed":
      return { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
  }
};

const BookingDetailsModal: React.FC<Props> = ({ open, booking, onClose }) => {
  if (!open || !booking) return null;

  const styles = getStatusStyles(booking.status);
  const statusLabel = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{booking.serviceName}</h2>
              <p className="text-purple-100 text-sm">{booking.serviceType}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${styles.border} ${styles.bg} ${styles.text}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.customerImage && (
                <div className="md:col-span-2 flex justify-center mb-2">
                  <img
                    src={booking.customerImage}
                    alt={booking.customerName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                </div>
              )}
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <User className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{booking.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Email Address</p>
                  <p className="font-semibold text-gray-900 break-all">{booking.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                  <p className="font-semibold text-gray-900">{booking.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Customer Address</p>
                  <p className="font-semibold text-gray-900">{booking.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <Calendar className="w-5 h-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Requested Date</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <MapPin className="w-5 h-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Event Location</p>
                  <p className="font-semibold text-gray-900">{booking.eventLocation}</p>
                </div>
              </div>
              {booking.guestCount !== undefined && booking.guestCount > 0 && (
                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <Users className="w-5 h-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Guest Capacity</p>
                    <p className="font-semibold text-gray-900">{booking.guestCount} guests</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Packages */}
          {booking.packages && booking.packages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Available Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-2">{pkg.packageName}</h4>
                    <p className="text-lg font-bold text-blue-600 mb-2">LKR {pkg.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-700">{pkg.features}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Photos */}
          {booking.photos && booking.photos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                Service Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {booking.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Service ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;