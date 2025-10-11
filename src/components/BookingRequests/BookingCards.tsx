import React from "react";
import { Calendar, User, Eye, CheckCircle, XCircle, Check } from "lucide-react";
import { BookingRequest } from "./Types";

interface Props {
  booking: BookingRequest;
  onView: (b: BookingRequest) => void;
  onUpdateStatus: (bookingId: string, status: "confirmed" | "cancelled" | "completed") => void;
}

const getStatusStyles = (status?: string) => {
  if (!status) return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", dot: "bg-gray-500" };
  
  switch (status.toLowerCase()) {
    case "pending":
      return { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-300", dot: "bg-yellow-500" };
    case "confirmed":
      return { bg: "bg-green-50", text: "text-green-800", border: "border-green-300", dot: "bg-green-500" };
    case "completed":
      return { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-300", dot: "bg-purple-500" };
    case "cancelled":
      return { bg: "bg-red-50", text: "text-red-800", border: "border-red-300", dot: "bg-red-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300", dot: "bg-gray-500" };
  }
};

const formatDate = (dateStr?: string) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const BookingCard: React.FC<Props> = ({ booking, onView, onUpdateStatus }) => {
  const status = (booking?.status ?? "pending").toString().toLowerCase();
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const styles = getStatusStyles(status);

  const serviceName = booking?.serviceName ?? "Unnamed Service";
  const serviceType = booking?.serviceType ?? "";
  const customerName = booking?.customerName ?? "Customer";
  const requestedDate = booking?.createdAt;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{serviceName}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.border} ${styles.bg} ${styles.text} flex items-center gap-1.5`}>
                <span className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse`}></span>
                {statusLabel}
              </span>
            </div>
            {serviceType && <p className="text-sm text-gray-600">{serviceType}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onView(booking)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>

            {status === "pending" && (
              <>
                <button
                  onClick={() => onUpdateStatus(booking.id, "confirmed")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all shadow-md font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm
                </button>
                <button
                  onClick={() => onUpdateStatus(booking.id, "cancelled")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all shadow-md font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}

            {status === "confirmed" && (
              <button
                onClick={() => onUpdateStatus(booking.id, "completed")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all shadow-md font-medium"
              >
                <Check className="w-4 h-4" />
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Customer Name</p>
              <p className="text-sm font-semibold text-gray-900">{customerName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Requested Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(requestedDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;