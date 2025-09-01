"use client";

import React, { useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("wedeaseEvent", JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving event:", error);
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
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                name="brideName"
                type="text"
                value={formData.brideName}
                onChange={handleChange}
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
