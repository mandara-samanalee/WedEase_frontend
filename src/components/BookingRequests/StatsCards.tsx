import React from "react";
import { Calendar, Clock, Check, X } from "lucide-react";
import { BookingRequest } from "./Types";

interface Props {
  bookings: BookingRequest[];
}

const StatsCards: React.FC<Props> = ({ bookings }) => {
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const acceptedCount = bookings.filter(b => b.status === "accepted").length;
  const declinedCount = bookings.filter(b => b.status === "declined").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Requests</p>
            <p className="text-xl font-bold text-gray-900">{bookings.length}</p>
          </div>
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Accepted</p>
            <p className="text-xl font-bold text-green-600">{acceptedCount}</p>
          </div>
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Declined</p>
            <p className="text-xl font-bold text-red-600">{declinedCount}</p>
          </div>
          <X className="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;