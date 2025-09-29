import React from "react";
import { X, User, Mail, Phone, MapPin, Calendar, Clock, DollarSign } from "lucide-react";
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

const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const BookingDetailsModal: React.FC<Props> = ({ open, booking, onClose }) => {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{booking.serviceName}</h2>
              <p className="text-gray-600 text-sm">{booking.serviceType}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Name</p>
                  <p className="font-medium text-sm">{booking.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-medium text-sm">{booking.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="font-medium text-sm">{booking.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Address</p>
                  <p className="font-medium text-sm">{booking.customerAddress}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Event Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Event Date</p>
                  <p className="font-medium text-sm">{formatDate(booking.eventDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Event Time</p>
                  <p className="font-medium text-sm">{formatTime(booking.eventTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Venue</p>
                  <p className="font-medium text-sm">{booking.eventLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Guest Count</p>
                  <p className="font-medium text-sm">{booking.guestCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="font-medium text-md">LKR{booking.totalAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Booking Date</p>
                  <p className="font-medium text-sm">{formatDate(booking.bookingDate || booking.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">Special Requests</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-800 text-sm">{booking.specialRequests}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;