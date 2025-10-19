"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { Guest } from "@/components/RSVP/GuestTypes";
import { RSVPStats } from "@/components/RSVP/RSVPStats";
import DefaultButton from "@/components/DefaultButton";
import { FileText, Download } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type StatusKey = Guest["responseStatus"];
const STATUS_ORDER: StatusKey[] = ["ACCEPTED", "PENDING", "INVITED", "DECLINED", "PRELISTED"];

export default function RSVPResponsesPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Load guest data from API
  useEffect(() => {
    const fetchGuests = async () => {
      const { token, userId } = getSession();

      if (!userId || !token) {
        toast.error("Please login to continue.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/rsvp/get-all-guests/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load guests: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status && result.data?.guests) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const guestList: Guest[] = result.data.guests.map((guest: any) => ({
            id: guest.id,
            guestName: guest.guestName || '',
            phone: guest.phone || '',
            Gender: guest.Gender as Guest["Gender"] || 'Male',
            childCount: guest.childCount || 0,
            alcoholPref: guest.alcoholPref as Guest["alcoholPref"] || 'unknown',
            mealPref: guest.mealPref || '',
            plus: guest.plus || 0,
            side: guest.side as Guest["side"] || 'Bride',
            responseStatus: guest.responseStatus as Guest["responseStatus"] || 'PRELISTED',
            notes: guest.notes || '',
            createdAt: guest.createdAt || new Date().toISOString(),
            updatedAt: guest.updatedAt || new Date().toISOString()
          }));
          setGuests(guestList);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching guests:", error);
        toast.error("Error loading guests");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const grouped = useMemo(() => {
    const byStatus: Record<string, Guest[]> = {};
    guests.forEach((g) => {
      const key = g.responseStatus || "PRELISTED";
      (byStatus[key] ||= []).push(g);
    });
    return byStatus;
  }, [guests]);

  // CSV export
  const exportCSV = useCallback(() => {
    const header = [
      "Name",
      "Phone",
      "Side",
      "Gender",
      "Children",
      "Status",
      "Plus Ones",
      "Meal Preference",
      "Alcohol Preference",
      "Notes",
    ];
    const rows = guests.map((g) => [
      g.guestName || "",
      g.phone || "",
      g.side || "",
      g.Gender || "",
      g.childCount ?? 0,
      g.responseStatus || "",
      g.plus ?? 0,
      g.mealPref || "",
      g.alcoholPref || "",
      g.notes || "",
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp-responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [guests]);

  // PDF export
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setTextColor(130, 48, 90);
    doc.text("RSVP Responses", 14, 16);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Guests: ${guests.length}`, 14, 23);

    let y = 30;
    for (const status of STATUS_ORDER) {
      const list = grouped[status] || [];
      if (list.length === 0) continue;
      
      autoTable(doc, {
        startY: y,
        head: [[
          `${status} (${list.length})`,
          "Phone",
          "Side",
          "Gender",
          "Children",
          "Plus Ones",
          "Meal Preference",
          "Alcohol",
          "Notes",
        ]],
        body: list.map((g) => [
          g.guestName || "—",
          g.phone || "—",
          g.side,
          g.Gender || "—",
          g.childCount ?? 0,
          g.plus ?? 0,
          g.mealPref || "—",
          g.alcoholPref || "—",
          g.notes || "—",
        ]),
        styles: { fontSize: 8 },
        theme: "grid",
        headStyles: { fillColor: [130, 48, 90], textColor: 255 },
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const finalY = (doc as any).lastAutoTable?.finalY;
      y = (typeof finalY === "number" ? finalY : y) + 6;
    }
    doc.save("rsvp-responses.pdf");
  };

  const cardClasses = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "border-green-200 from-green-50 via-white to-white";
      case "PENDING":
        return "border-amber-200 from-amber-50 via-white to-white";
      case "INVITED":
        return "border-purple-200 from-purple-50 via-white to-white";
      case "DECLINED":
        return "border-rose-200 from-rose-50 via-white to-white";
      case "PRELISTED":
        return "border-blue-200 from-blue-50 via-white to-white";
      default:
        return "border-gray-200 from-gray-50 via-white to-white";
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "INVITED":
        return "bg-purple-100 text-purple-700";
      case "DECLINED":
        return "bg-rose-100 text-rose-700";
      case "PRELISTED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-6xl pb-24 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
              RSVP Responses
            </h1>
            <p className="text-gray-600">
              Overview of guest confirmations and declines.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DefaultButton
              btnLabel="Export CSV"
              Icon={<Download size={16} />}
              handleClick={exportCSV}
              className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
            />
            <DefaultButton
              btnLabel="Export PDF"
              Icon={<FileText size={16} />}
              handleClick={exportPDF}
              className="!w-auto !bg-purple-600 !text-white px-4 py-2 rounded-lg text-sm hover:!bg-purple-700"
            />
          </div>
        </div>

        <RSVPStats guests={guests} />

        {/* <div className="max-w-4xl mx-auto py-2">
                    <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                    <Loader className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading Guest Responses...</p>
                    </div>
                </div>
              </div> */}

        {!loading && (
          <div className="space-y-8">
            {STATUS_ORDER.map((status) => {
              const list = grouped[status] || [];
              return (
                <div key={status} className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()} ({list.length})
                  </h2>
                  {list.length === 0 && (
                    <div className="text-sm text-gray-500 border rounded-md px-3 py-4 bg-gray-50">
                      No {status.toLowerCase()} guests.
                    </div>
                  )}
                  {list.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {list.map((g) => (
                        <div
                          key={g.id}
                          className={[
                            "relative rounded-xl border bg-gradient-to-br",
                            "px-5 py-4 text-sm flex flex-col",
                            "shadow-sm hover:shadow-md transition-shadow",
                            "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none",
                            "before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                            "before:bg-[radial-gradient(circle_at_30%_20%,rgba(128,0,128,0.07),transparent_60%)]",
                            cardClasses(g.responseStatus || ""),
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-semibold text-gray-800">
                              {g.guestName || "Unnamed Guest"}
                            </div>
                            <span
                              className={[
                                "text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full",
                                statusColor(g.responseStatus || "")
                              ].join(" ")}
                            >
                              {g.responseStatus}
                            </span>
                          </div>
                          <div className="mt-1 text-[14px] text-gray-600 flex flex-wrap gap-x-2 gap-y-0.5">
                            <span>{g.phone || "—"}</span>
                            <span>| Side: {g.side}</span>
                            {g.Gender && (
                              <span>
                                | {g.Gender}
                              </span>
                            )}
                            {(g.childCount ?? 0) > 0 && (
                              <span>| Children: {g.childCount}</span>
                            )}
                            {g.plus ? <span>| +{g.plus}</span> : null}
                          </div>
                          {(g.mealPref || g.notes) && (
                            <div className="mt-1 text-[14px] text-gray-700 line-clamp-2">
                              {g.mealPref && <span>Meal: {g.mealPref}</span>}
                              {g.mealPref && g.notes && <span> | </span>}
                              {g.notes && <span>{g.notes}</span>}
                            </div>
                          )}
                          {g.alcoholPref && g.alcoholPref !== 'unknown' && (
                            <div className="mt-1 text-[12px] text-gray-600">
                              Alcohol: {g.alcoholPref}
                            </div>
                          )}
                          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-purple-200/40 to-transparent" />
                          <div className="mt-2 flex items-center justify-between">
                            {(g.childCount ?? 0) > 0 && (
                              <span className="text-[11px] text-purple-600 font-medium">
                                Family
                              </span>
                            )}
                            {g.plus > 0 && (
                              <span className="text-[11px] text-blue-600 font-medium">
                                +{g.plus} guests
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerMainLayout>
  );
}