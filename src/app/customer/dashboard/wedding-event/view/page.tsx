"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { Calendar, Users, MapPin, Clock, FileText } from "lucide-react";

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
          title: parsedEvent.title || parsedEvent.name || "-",
          groomName: parsedEvent.groomName || "",
          brideName: parsedEvent.brideName || "",
          date: parsedEvent.date || parsedEvent.day || "-",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setEvent(null);
      setShowDeleteConfirm(false);
      router.push("/customer/dashboard");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!event && !isEditing) {
    return (
      <CustomerMainLayout>
        <div className="max-w-2xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">View Event</h1>
          <p className="text-gray-700">No event found. Please create an event first.</p>
          <Link href="/customer/dashboard/event/create">
            <DefaultButton btnLabel="Create Event" className="mt-4" />
          </Link>
        </div>
      </CustomerMainLayout>
    );
  }

  return (
    <CustomerMainLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">View Event</h1>
          {!isEditing && (
            <div className="flex gap-4">
              <DefaultButton btnLabel="Edit Event" onClick={toggleEdit} className="bg-purple-500 hover:bg-purple-600 text-white" />
              <DefaultButton
                btnLabel="Delete Event"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Event Title</label>
              <div className="flex-1">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Couple Names</label>
              <div className="flex-1">
                <div className="flex gap-4 w-full">
                  <input
                    name="groomName"
                    type="text"
                    value={formData.groomName}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <input
                    name="brideName"
                    type="text"
                    value={formData.brideName}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Event Date</label>
              <div className="flex-1">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Start/End Time</label>
              <div className="flex-1">
                <div className="flex items-center gap-6">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                  <span className="text-purple-900 font-semibold">to</span>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Location</label>
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold mt-2">Description</label>
              <div className="flex-1 min-w-[300px]">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <label className="w-40 block text-purple-900 font-semibold">Guests Count</label>
              <div className="flex-1">
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  min={0}
                  className="w-28 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <DefaultButton
                btnLabel="Save Changes"
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white"
              />
              <DefaultButton
                btnLabel="Cancel"
                onClick={toggleEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-6 bg-gradient-to-b from-purple-100 to-purple-300 p-6 rounded-lg shadow-lg border-2 border-purple-500">
            <div className="flex items-center gap-4">
              <Calendar className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Event Title</h2>
                <p className="text-gray-900">{event?.title || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Couple Names</h2>
                <p className="text-gray-900">{event?.groomName && event?.brideName ? `${event.groomName} & ${event.brideName}` : "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Event Date</h2>
                <p className="text-gray-900">{event?.date || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple900">Time</h2>
                <p className="text-gray-900">{event?.startTime && event?.endTime ? `${event.startTime} - ${event.endTime}` : "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Location</h2>
                <p className="text-gray-900">{event?.location || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FileText className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Description</h2>
                <p className="text-gray-900">{event?.description || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="text-purple-700 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-purple-900">Guests Count</h2>
                <p className="text-gray-900">{event?.guestCount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex gap-4 justify-end">
                <DefaultButton
                  btnLabel="Cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                />
                <DefaultButton
                  btnLabel="Delete"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerMainLayout>
  );
}