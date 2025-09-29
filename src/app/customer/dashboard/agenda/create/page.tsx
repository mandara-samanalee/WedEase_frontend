"use client";

import React, { useRef, useState, useEffect } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { Plus, Trash2, Loader } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type AgendaItem = {
  id: number;
  activity: string;
  note: string;
  startTime: string;
  endTime: string;
  location: string;
};

export default function CreateAgendaPage() {
  const [date, setDate] = useState<string>("");
  const [displayDate, setDisplayDate] = useState<string>("");
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const nextIdRef = useRef(-1);
  const nextId = () => nextIdRef.current--;

  const getSession = () => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        return { userId: user?.userId, token };
      }
      return { userId: undefined, token: token || "" };
    } catch {
      return { userId: undefined, token: "" };
    }
  };

  const getEventId = (): string | null => {
    try {
      const raw = localStorage.getItem("wedeaseEvent");
      if (raw) {
        const ev = JSON.parse(raw);
        if (ev?.id) return String(ev.id);
        if (ev?.eventId) return String(ev.eventId);
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Format date as DD/MM/YYYY
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Get event date from API
  const getEventDate = async (eventId: string, token: string): Promise<string | null> => {
    try {
      const response = await fetch(`${BASE_URL}/event/${eventId}`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.date) {
          return result.data.date;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching event date:", error);
      return null;
    }
  };

  // Fetch agenda items and event date from API
  useEffect(() => {
    const fetchAgendaAndDate = async () => {
      const { token } = getSession();
      const eventId = getEventId();

      if (!eventId || !token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch event date first
        const eventDate = await getEventDate(eventId, token);
        if (eventDate) {
          setDate(eventDate);
          setDisplayDate(formatDisplayDate(eventDate));
        }

        // Then fetch agenda items
        const response = await fetch(`${BASE_URL}/agenda/${eventId}`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setItems([{ id: nextId(), activity: "", note: "", startTime: "", endTime: "", location: "" }]);
            return;
          }
          throw new Error(`Failed to load agenda: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          const transformedItems = transformApiResponse(result.data);
          transformedItems.sort((a, b) => (a.id - b.id));
          setItems(transformedItems.length > 0 ? transformedItems : 
            [{ id: nextId(), activity: "", note: "", startTime: "", endTime: "", location: "" }]);
        } else {
          setItems([{ id: nextId(), activity: "", note: "", startTime: "", endTime: "", location: "" }]);
        }
        
      } catch (error) {
        console.error("Error fetching agenda:", error);
        toast.error("Error loading agenda");
        setItems([{ id: nextId(), activity: "", note: "", startTime: "", endTime: "", location: "" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendaAndDate();
  }, []);

  // Transform API response to frontend format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformApiResponse = (apiItems: any[]): AgendaItem[] => {
    return apiItems.map(item => {
      let startTime = "";
      let endTime = "";

      if (item.startTime) {
        try {
          startTime = new Date(item.startTime).toTimeString().slice(0, 5);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.error("Error parsing startTime:", item.startTime);
        }
      }

      if (item.endTime) {
        try {
          endTime = new Date(item.endTime).toTimeString().slice(0, 5);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.error("Error parsing endTime:", item.endTime);
        }
      }
      
      return {
        id: item.id,
        activity: item.Activity || "",
        note: item.notes || "",
        startTime,
        endTime,
        location: item.location || ""
      };
    });
  };

  // Transform frontend data to API format
  const transformToApiFormat = (frontendItems: AgendaItem[], eventDate: string) => {
    return frontendItems.map(item => {
      let startDateTime = null;
      let endDateTime = null;

      // Only create DateTime if both date and time are provided and not empty
      if (eventDate && item.startTime && item.startTime.trim() !== "") {
        startDateTime = `${eventDate.split('T')[0]}T${item.startTime}:00Z`;
      }

      if (eventDate && item.endTime && item.endTime.trim() !== "") {
        endDateTime = `${eventDate.split('T')[0]}T${item.endTime}:00Z`;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiItem: any = {
        Activity: item.activity || "",
        startTime: startDateTime,
        endTime: endDateTime,
        location: item.location || "",
        notes: item.note || ""
      };

      // Only include ID for existing items (positive IDs)
      if (item.id > 0) {
        apiItem.id = item.id;
      }

      return apiItem;
    });
  };

    // Add validation 
    const validateTimeRange = (startTime: string, endTime: string): string | null => {
    if (!startTime || !endTime) return null; // No validation if either time is empty
  
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
  
    if (endTotalMinutes <= startTotalMinutes) {
    return "End time must be after start time";
  }
  
    return null;
  };

  const addItem = () =>
    setItems((prev) => {
      const last = prev[prev.length - 1];
      const startFromPrevEnd = last?.endTime || "";
      return [
        ...prev,
        {
          id: nextId(),
          activity: "",
          note: "",
          startTime: startFromPrevEnd,
          endTime: "",
          location: "",
        },
      ];
    });

  const updateItem = (id: number, key: keyof AgendaItem, value: string) =>
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx === -1) return prev;
      const arr = [...prev];
      const current = arr[idx];
      arr[idx] = { ...current, [key]: value };

      // If endTime changes and next card has empty startTime, auto-fill it
    if (key === "endTime") {
      const next = arr[idx + 1];
      if (next && !next.startTime) {
        arr[idx + 1] = { ...next, startTime: value };
      }
    }
    return arr;
  });

  const removeItem = async (id: number) => {
    const { token } = getSession();

    if (id < 0) {
      setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.id !== id)));
      toast.success("Item removed");
      return;
    }

    if (!token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/agenda/delete-item/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }

      setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.id !== id)));
      toast.success("Item deleted successfully");
      
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleSave = async () => {
    const { token } = getSession();
    const eventId = getEventId();

    if (!eventId || !token) {
      toast.error("Please select an event and login to continue.");
      return;
    }

    // Filter out completely empty items
    const validItems = items.filter(item => 
      item.activity.trim() || item.note.trim() || item.startTime || item.endTime || item.location.trim()
    );

    if (validItems.length === 0) {
      toast.error("Please add at least one agenda item");
      return;
    }

    // Validate time ranges for all items
  const timeErrors: string[] = [];
  
  validItems.forEach((item, index) => {
    if (item.startTime && item.endTime) {
      const error = validateTimeRange(item.startTime, item.endTime);
      if (error) {
        timeErrors.push(`Item ${index + 1}: ${error}`);
      }
    }
  });
  
  if (timeErrors.length > 0) {
    toast.error(timeErrors.join(', '));
    return;
  }

    try {
      const payload = {
        eventId,
        items: transformToApiFormat(validItems, date || "")
      };

      console.log('Saving payload:', payload);

      const response = await fetch(`${BASE_URL}/agenda/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to save agenda: ${response.status}`);
      }

      const result = await response.json();
      console.log('Save successful:', result);
      
      toast.success("Agenda saved successfully!");
      
    } catch (error) {
      console.error("Save agenda error:", error);
      toast.error("Failed to save agenda");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    const header = "Event Day Agenda";
    const centerX = pageWidth / 2;
    doc.text(header, centerX, 18, { align: "center" });

    // Meta - show formatted date (DD/MM/YYYY)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(96, 96, 96);
    const metaY = 26;
    const metaLines = [`Date: ${displayDate || "-"}`];
    metaLines.forEach((line, i) => doc.text(line, 14, metaY + i * 6));

    // Table (Activity, Note, Start, End, Location)
    const head = [["Activity", "Note", "Start", "End", "Location"]];
    const body = items.map((i) => [
      i.activity || "",
      i.note || "",
      i.startTime || "",
      i.endTime || "",
      i.location || "",
    ]);

    autoTable(doc, {
      head,
      body,
      startY: metaY + metaLines.length * 6 + 6,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [130, 48, 90], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 48 },
        1: { cellWidth: pageWidth - 14 - 14 - 25 - 25 - 40 - 48 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 40 },
      },
    });

    doc.save(`agenda-${displayDate || "untitled"}.pdf`);
  };

  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="max-w-5xl pb-24">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your Tasklist...</p>
            </div>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  return (
    <CustomerMainLayout>
      <div className="max-w-5xl pb-24">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">Event Day Timeline</h1>
        
        {/* Top bar with Date on the right */}
        <div className="mt-4 mb-2 flex items-center justify-between gap-4">
          <DefaultButton
            btnLabel="Add Item"
            Icon={<Plus size={16} />}
            handleClick={addItem}
            className="!w-auto inline-flex items-center px-3 py-2 !bg-white !text-purple-600 hover:!text-purple-800"
          />
          <div className="flex items-center gap-2">
            <label className="text-md text-gray-600 mr-2">Date:</label>
            <div className="px-2 py-1 text-gray-900 border-0 border-b border-gray-400">
              {displayDate || "No date set"}
            </div>
          </div>
        </div>

        {/* Items list (cards) */}
        <div className="space-y-4">
          {items.map((it) => {
            
            return (
              <div key={it.id} className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-pink p-[1px]">
                <div className="bg-white rounded-[inherit] p-5">
                  {/* Activity + Note */}
                  <div className="mb-3">
                    <input
                      value={it.activity}
                      onChange={(e) => updateItem(it.id, "activity", e.target.value)}
                      placeholder="Untitled"
                      className="w-full text-lg font-semibold text-gray-900 bg-transparent border-0 focus:outline-none focus:ring-0"
                    />
                    <input
                      value={it.note}
                      onChange={(e) => updateItem(it.id, "note", e.target.value)}
                      placeholder="Note"
                      className="w-full text-md text-purple-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                    />
                  </div>

                  <div className="h-px bg-gray-300 mb-3" />

                  {/* Sections: Start time, End time, Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start time</label>
                      <input
                        type="time"
                        value={it.startTime}
                        onChange={(e) => updateItem(it.id, "startTime", e.target.value)}
                        className="w-full px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End time</label>
                      <input
                        type="time"
                        value={it.endTime}
                        onChange={(e) => updateItem(it.id, "endTime", e.target.value)}
                        className={`w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 ${
                           it.startTime && it.endTime && validateTimeRange(it.startTime, it.endTime) 
                           ? "border-red-400 bg-red-50" 
                           : "border-purple-300"
                        }`}
                      />
                      {it.startTime && it.endTime && validateTimeRange(it.startTime, it.endTime) && (
                        <p className="text-red-500 text-xs mt-1">
                          {validateTimeRange(it.startTime, it.endTime)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Location</label>
                      <input
                        value={it.location}
                        onChange={(e) => updateItem(it.id, "location", e.target.value)}
                        placeholder="Location"
                        className="w-full px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-2"
                      title="Delete"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={16} />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top-level actions */}
        <div className="flex items-center gap-4 mt-6">
          <DefaultButton
            btnLabel="Export PDF"
            handleClick={exportPDF}
            className="!bg-white !text-purple-600 border border-purple-600 rounded-md hover:!bg-purple-50 flex items-center justify-center tracking-wide"
          />
          <DefaultButton
            btnLabel="Save"
            handleClick={handleSave}
          />
        </div>
      </div>
    </CustomerMainLayout>
  );
}

