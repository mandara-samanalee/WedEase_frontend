"use client";

import React, { useRef, useState } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import DefaultButton from "@/components/DefaultButton";
import { Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type AgendaItem = {
  id: number;
  activity: string;   // "Untitled" in UI
  note: string;       // "Note" in UI
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  location: string;
};

export default function CreateAgendaPage() {
  // Top date (Day)
  const [date, setDate] = useState<string>("");

  // Agenda items (each card = one WeddingAgenda row)
  const [items, setItems] = useState<AgendaItem[]>([
    { id: 1, activity: "", note: "", startTime: "", endTime: "", location: "" },
  ]);

  // Client-only id generator (no Date.now to avoid hydration issues)
  const nextIdRef = useRef(2);
  const nextId = () => nextIdRef.current++;

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

  const updateItem = (
    id: number,
    key: keyof AgendaItem,
    value: string
  ) =>
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

  const removeItem = (id: number) =>
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((it) => it.id !== id)));

  // Silent submit 
  const handleSave = () => {
    // Prepare payload for backend (one record per item)
    // Example mapping to your WeddingAgenda model:
    // items.map(i => ({
    //   eventId,
    //   Activity: i.activity,
    //   Day: date ? new Date(date) : null,
    //   startTime: date && i.startTime ? new Date(`${date}T${i.startTime}:00`) : null,
    //   endTime: date && i.endTime ? new Date(`${date}T${i.endTime}:00`) : null,
    //   location: i.location,
    //   notes: i.note,
    // }));
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

    // Meta
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(96, 96, 96);
    const metaY = 26;
    const metaLines = [`Date: ${date || "-"}`];
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
      headStyles: { fillColor: [130, 48, 90], textColor: 255 }, // purple-600
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 }, // 14 mm
      columnStyles: {
        0: { cellWidth: 48 }, // Activity
        1: { cellWidth: pageWidth - 14 - 14 - 25 - 25 - 40 - 48 }, // Note flex
        2: { cellWidth: 25 }, // Start
        3: { cellWidth: 25 }, // End
        4: { cellWidth: 40 }, // Location
      },
    });

    doc.save(`agenda-${date || "untitled"}.pdf`);
  };

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
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-2 py-1 border-0 border-b border-gray-400 focus:outline-none focus:border-brand-violet"
            />
          </div>
        </div>

        {/* Items list (cards) */}
        <div className="space-y-4">
          {items.map((it) => {
            const invalidEnd = it.startTime && it.endTime && it.endTime < it.startTime;
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
                        className={`w-full px-2 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 ${invalidEnd ? "border-red-400" : "border-gray-200"
                          }`}
                        aria-invalid={invalidEnd || undefined}
                        title={invalidEnd ? "End time must be after start time" : ""}
                      />
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