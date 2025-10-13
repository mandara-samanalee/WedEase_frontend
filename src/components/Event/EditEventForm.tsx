"use client";
import React from "react";
import { Edit3 } from "lucide-react";
import DefaultButton from "@/components/DefaultButton";

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

interface EditEventFormProps {
  formData: EventData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EditEventForm: React.FC<EditEventFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="space-y-6">
      {/* Header - Moved outside the form */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-purple-800" />
            Edit Event Details
          </h1>
          <p className="text-gray-600 mt-1">
            Update your event information
          </p>
        </div>
      </div>

    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              min={0}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              onChange={onInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-6 pt-6">
          <DefaultButton 
            btnLabel={"Save Changes"} 
          />
          <DefaultButton
            btnLabel="Cancel"
            handleClick={onCancel}
            className="!bg-white !text-purple-600 border border-purple-600 rounded-md hover:!bg-purple-50 flex items-center justify-center tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </form>
    </div>
  );
};

export default EditEventForm;