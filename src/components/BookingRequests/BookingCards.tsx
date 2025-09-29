import React from "react";
import { Calendar, Clock, Check, X } from "lucide-react";
import { BookingRequest } from "./Types";

interface Props {
  booking: BookingRequest;
  onView: (b: BookingRequest) => void;
  onUpdateStatus: (bookingId: string, status: "accepted" | "declined") => void;
}

const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "accepted":
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "declined":
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateStr?: string) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

const BookingCard: React.FC<Props> = ({ booking, onView, onUpdateStatus }) => {
  // defensive defaults for potentially undefined fields
  const statusRaw = (booking?.status ?? "pending").toString();
  const status = statusRaw ? statusRaw.toLowerCase() : "pending";
  const statusLabel = status.length ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";

  const serviceName = booking?.serviceName ?? "Unnamed Service";
  const customerName = booking?.customerName ?? "Customer";
  const eventDate = booking?.eventDate;
  const totalAmount = booking?.totalAmount ?? 0;
  const eventLocation = booking?.eventLocation ?? "Not specified";

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <h3 className="text-md font-semibold text-gray-900">{serviceName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                {statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{customerName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(eventDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4" />
                <span className="font-medium">LKR {Number(totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{eventLocation}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onView(booking)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition w-[160px] text-sm bg-purple-600 text-white hover:bg-purple-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden />
              View Details
            </button>

            {status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateStatus(booking.id, "accepted")}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-[110px] text-sm"
                >
                  <Check className="w-4 h-4" /> Accept
                </button>
                <button
                  onClick={() => onUpdateStatus(booking.id, "declined")}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-[110px] text-sm"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
