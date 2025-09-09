"use client";

import React, { useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
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

  const getUserId = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.userId;
      }
      return null;
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "guestCount" ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = getUserId();
    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    // Check if end time is after start time
    if (formData.endTime <= formData.startTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      // Prepare the request body according to API specification
      const requestBody = {
        title: formData.title.trim(),
        GroomName: formData.groomName.trim(),
        BrideName: formData.brideName.trim(),
        date: new Date(formData.date).toISOString(),
        startTime: new Date(`${formData.date}T${formData.startTime}:00`).toISOString(),
        endTime: new Date(`${formData.date}T${formData.endTime}:00`).toISOString(),
        location: formData.location.trim(),
        Description: formData.description.trim(),
        GuestCount: formData.guestCount,
        createdBy: userId
      };

      console.log("Sending request body:", requestBody);

      const response = await fetch(`${BASE_URL}/event/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Success
      toast.success("Event created successfully!");

       // Store event data locally as backup
      try {
        localStorage.setItem("wedeaseEvent", JSON.stringify({
          ...formData,
          id: data.id || data._id,
          createdAt: new Date().toISOString()
        }));
      } catch (error) {
        console.warn("Could not save to localStorage:", error);
      }

      // Reset form
      setFormData({
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

    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create event. Please try again.");
    } 
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-8">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Event Title</label>
            <div className="flex-1">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* Couple Names */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Couple Names</label>
            <div className="flex-1 flex gap-4">
              <input
                name="groomName"
                type="text"
                value={formData.groomName}
                onChange={handleChange}
                placeholder="Groom's Name"
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                name="brideName"
                type="text"
                value={formData.brideName}
                onChange={handleChange}
                placeholder="Bride's Name"
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Event Date</label>
            <div className="flex-1">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* Start / End Time */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Start / End Time</label>
            <div className="flex-1 flex items-center gap-6">
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <span className="text-gray-600">to</span>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-32 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Location</label>
            <div className="flex-1">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-6 mb-4">
            <label className="w-40 block mt-2">Description</label>
            <div className="flex-1">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Guests Count */}
          <div className="flex items-center gap-6 mb-4">
            <label className="w-40 block">Guests Count</label>
            <div className="flex-1">
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                min={0}
                className="w-28 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pb-24">
            <DefaultButton btnLabel="Create event" className="mt-2" />
          </div>
        </form>
      </div>
    </CustomerMainLayout>
  );
}
