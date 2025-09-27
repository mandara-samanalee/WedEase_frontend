"use client";
import React, { useEffect, useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import Link from "next/link";
import toast from "react-hot-toast";
import { Heart, Loader } from "lucide-react";
import EditEventForm from "@/components/Event/EditEventForm";
import EventDetailsView from "@/components/Event/ViewEventModal";
import DeleteEventModal from "@/components/Event/DeleteEventModal";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export default function ViewEventPage() {
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.userId;
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Fetch event from API
  const fetchEvent = async () => {
    const userId = getUserId();

    if (!userId) {
      toast.error("User not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/event/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404 || data.message?.includes("No wedding events found")) {
          setEvent(null);
          setLoading(false);
          return;
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Transform API response to match our interface
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const eventData = data.data[0];

        const transformedEvent: EventData = {
          id: eventData.id,
          title: eventData.title,
          groomName: eventData.GroomName || "",
          brideName: eventData.BrideName || "",
          date: eventData.date ? eventData.date.split('T')[0] : "",
          startTime: eventData.startTime ? new Date(eventData.startTime).toTimeString().slice(0, 5) : "",
          endTime: eventData.endTime ? new Date(eventData.endTime).toTimeString().slice(0, 5) : "",
          location: eventData.location,
          description: eventData.Description || "",
          guestCount: eventData.GuestCount || 0,
          createdBy: eventData.createdBy
        };

        setEvent(transformedEvent);
        setFormData(transformedEvent);

        // Also save to localStorage as backup
        try {
          localStorage.setItem("wedeaseEvent", JSON.stringify(transformedEvent));
        } catch (error) {
          console.warn("Could not save to localStorage:", error);
        }
      } else {
        setEvent(null);
      }

    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event data");

      // Fallback to localStorage if API fails
      try {
        const eventRaw = localStorage.getItem("wedeaseEvent");
        if (eventRaw) {
          const parsedEvent = JSON.parse(eventRaw);
          setEvent(parsedEvent);
          setFormData(parsedEvent);
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update event via API
  const updateEvent = async (updatedData: EventData) => {
    if (!event?.id) {
      toast.error("Event ID not found");
      return false;
    }

    try {
      setUpdating(true);

      // Prepare request body matching the create API format
      const requestBody = {
        title: updatedData.title.trim(),
        GroomName: updatedData.groomName.trim(),
        BrideName: updatedData.brideName.trim(),
        date: new Date(updatedData.date).toISOString(),
        startTime: new Date(`${updatedData.date}T${updatedData.startTime}:00`).toISOString(),
        endTime: new Date(`${updatedData.date}T${updatedData.endTime}:00`).toISOString(),
        location: updatedData.location.trim(),
        Description: updatedData.description.trim(),
        GuestCount: updatedData.guestCount
      };

      const response = await fetch(`${BASE_URL}/event/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Event Details updated successfully!");
      fetchEvent(); // Refetch the updated event
      return true;

    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Delete event via API
  const deleteEvent = async () => {
    if (!event?.id) return;

    try {
      setDeleting(true);

      const response = await fetch(`${BASE_URL}/event/${event.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      toast.success("Event deleted successfully!");

      // Clear localStorage
      try {
        localStorage.removeItem("wedeaseEvent");
      } catch (error) {
        console.warn("Could not clear localStorage:", error);
      }

      setEvent(null);
      setShowDeleteConfirm(false);

    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    const success = await updateEvent(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteEvent();
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

  // Loading state
  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto py-2">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader className="animate-spin text-4xl text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your event...</p>
            </div>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  // No event found state
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
        {isEditing ? (
          <EditEventForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={toggleEdit}
            loading={updating}
          />
        ) : (
          event && (
            <EventDetailsView
              event={event}
              onEdit={toggleEdit}
              onDelete={() => setShowDeleteConfirm(true)}
              loading={updating || deleting}
            />
          )
        )}

        {/* Delete Confirmation Modal */}
        <DeleteEventModal
          event={event}
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </CustomerMainLayout>
  );
}