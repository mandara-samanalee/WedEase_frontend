"use client";
import React from "react";
import { Calendar, Users, MapPin, Clock, FileText, Edit3, Trash2, Heart } from "lucide-react";

interface EventData {
  id?: string;
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  guestCount: number;
  createdBy?: string;
}

interface EventDetailsViewProps {
  event: EventData;
  onEdit: () => void;
  onDelete: () => void;
  loading?: boolean;
}

const ViewEventModal: React.FC<EventDetailsViewProps> = ({
  event,
  onEdit,
  onDelete,
  loading = false
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
            Event Details
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your special day
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Edit3 size={16} />
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Event Card */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-pink-200" />
              <h2 className="text-3xl font-bold">
                {event?.title || "Wedding Event"}
              </h2>
            </div>
            <div className="text-xl font-medium text-pink-100">
              {event?.groomName && event?.brideName 
                ? `${event.groomName} & ${event.brideName}` 
                : "Couple Names Not Set"}
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 right-8 w-20 h-20 bg-pink-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Event Details Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date & Time Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-1">Event Date</h3>
                  <p className="text-gray-800 font-medium">
                    {formatDate(event?.date || "")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl border border-pink-100">
                <div className="bg-pink-600 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-900 mb-1">Event Time</h3>
                  <p className="text-gray-800 font-medium">
                    {event?.startTime && event?.endTime 
                      ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}` 
                      : "Time not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Guests Section */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="bg-emerald-600 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-900 mb-1">Venue Location</h3>
                  <p className="text-gray-800 font-medium">
                    {event?.location || "Location not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Expected Guests</h3>
                  <p className="text-gray-800 font-medium text-2xl">
                    {event?.guestCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {event?.description && (
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-2">Event Description</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;