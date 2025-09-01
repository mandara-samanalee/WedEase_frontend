"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  FileText, 
  Edit3, 
  Trash2, 
  Heart,
  ArrowLeft 
} from "lucide-react";

interface EventData {
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  guestCount: number;
}

export default function ViewEventPage() {
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EventData>({
    title: "",
    groomName: "",
    brideName: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    guestCount: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    try {
      const eventRaw = localStorage.getItem("wedeaseEvent") || localStorage.getItem("event") || localStorage.getItem("weddingEvent");
      if (eventRaw) {
        const parsedEvent = JSON.parse(eventRaw);
        setEvent(parsedEvent);
        setFormData({
          title: parsedEvent.title || parsedEvent.name || "",
          groomName: parsedEvent.groomName || "",
          brideName: parsedEvent.brideName || "",
          date: parsedEvent.date || parsedEvent.day || "",
          startTime: parsedEvent.startTime || "",
          endTime: parsedEvent.endTime || "",
          location: parsedEvent.location || "",
          description: parsedEvent.description || "",
          guestCount: parsedEvent.guestCount || 0,
        });
      }
    } catch {
      setEvent(null);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'guestCount' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("wedeaseEvent", JSON.stringify(formData));
      setEvent(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = () => {
    try {
      localStorage.removeItem("wedeaseEvent");
      localStorage.removeItem("event");
      localStorage.removeItem("weddingEvent");
      setEvent(null);
      setShowDeleteConfirm(false);
      router.push("/customer/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing && event) {
      // Reset form data if canceling edit
      setFormData({
        title: event.title || "",
        groomName: event.groomName || "",
        brideName: event.brideName || "",
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
        description: event.description || "",
        guestCount: event.guestCount || 0,
      });
    }
  };

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

  if (!event && !isEditing) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto py-2">
          <div className="text-center py-16">
            <div className="mb-8">
              <Heart className="w-24 h-24 text-purple-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">No Event Found</h1>
              <p className="text-lg text-gray-600 mb-8">
                Create your special event to get started with planning your perfect day.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link href="/customer/dashboard/wedding-event/create">
                <DefaultButton 
                  btnLabel="Create New Event" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg" 
                />
              </Link>
              <Link href="/customer/dashboard/overview">
                <DefaultButton 
                  btnLabel="Back to Dashboard" 
                  className="border border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg" 
                />
              </Link>
            </div>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  return (
    <CustomerMainLayout>
      <div className="max-w-4xl py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/customer/dashboard/wedding-event/create" className="text-purple-600 hover:text-purple-800">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                {isEditing ? "Edit Event" : "Event Details"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? "Update your event information" : "Manage your special day"}
              </p>
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex gap-3">
              <button
                onClick={toggleEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
              <h3 className="text-xl font-semibold text-purple-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                Edit Event Information
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                {/* Groom Name */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Groom&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="groomName"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Groom's full name"
                    required
                  />
                </div>

                {/* Bride Name */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Bride&apos;s Name
                  </label>
                  <input
                    type="text"
                    name="brideName"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Bride's full name"
                    required
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    required
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    min={0}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Number of guests"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    required
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    required
                  />
                </div>

                {/* Location */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    placeholder="Enter venue address or location"
                    required
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Event Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                    placeholder="Add special details about your event..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 mt-6 pt-6">
                <DefaultButton btnLabel="Save Changes" />
                <DefaultButton
                btnLabel="Cancel"
                handleClick={toggleEdit}
                className="!bg-white !text-purple-600 border border-purple-600 rounded-md hover:!bg-purple-50 flex items-center justify-center tracking-wide"
              />
              </div>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-6">
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
                <div className="mt-8 pt-6 border-t border-purple-100">
                    <Link href="/customer/dashboard/agenda/create">
                      <button className="px-6 py-3 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors font-medium">
                        Create Event Agenda
                      </button>
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Delete Event</h2>
                    <p className="text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">
                    Are you sure you want to delete &quot;{event?.title}&quot;?
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    All event data and associated information will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerMainLayout>
  );
}