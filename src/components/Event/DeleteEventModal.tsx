"use client";
import React from "react";
import { Trash2 } from "lucide-react";
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

interface DeleteEventModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return (
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
              Are you sure you want to delete &quot;{event.title}&quot;?
            </p>
            <p className="text-red-600 text-sm mt-1">
              All event data and associated information will be permanently removed.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <DefaultButton
              btnLabel="Cancel"
              handleClick={onClose}
              className="w-[130px] !bg-white !text-gray-700 border border-gray-300 rounded-lg hover:!bg-gray-50 flex items-center justify-center tracking-wide"
            />
            <DefaultButton
              btnLabel="Delete Event"
              handleClick={onConfirm}
              className="w-[130px] !bg-red-600 !text-white rounded-lg hover:!bg-red-700 flex items-center justify-center tracking-wide"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;