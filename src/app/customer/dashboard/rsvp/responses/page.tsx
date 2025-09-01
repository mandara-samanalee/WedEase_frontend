"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { Guest } from "@/components/RSVP/GuestTypes";
import { RSVPStats } from "@/components/RSVP/RSVPStats";
import DefaultButton from "@/components/DefaultButton";
import { FileText, Download } from "lucide-react";

type StatusKey = Guest["status"] | "pending";
const STATUS_ORDER: StatusKey[] = ["accepted", "pending", "invited", "declined"];

export default function RSVPResponsesPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load guest data (client only)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("wedeaseGuests");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setGuests(
              parsed.map((g) => ({
                ...g,
                status: g.status === "confirmed" ? "accepted" : g.status || "invited",
              }))
            );
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load guests", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const grouped = useMemo(() => {
    const byStatus: Record<string, Guest[]> = {};
    guests.forEach((g) => {
      const key = (g.status || "invited").toLowerCase();
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
      "PlusOnes",
      "Dietary",
      "Notes",
    ];
    const rows = guests.map((g) => [
      g.name || "",
      g.phone || "",
      g.side || "",
      g.gender || "",
      g.childCount ?? 0,
      g.status || "",
      g.plusOnes ?? 0,
      g.dietary || "",
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

  // PDF export (dynamic so SSR build does not break)
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
      autoTable(doc, {
        startY: y,
        head: [[
          `${status.toUpperCase()} (${list.length})`,
          "Phone",
          "Side",
          "Gender",
          "Children",
          "Plus",
          "Dietary",
          "Notes",
        ]],
        body: list.map((g) => [
          g.name || "—",
          g.phone || "—",
          g.side,
          g.gender || "—",
          g.childCount ?? 0,
          g.plusOnes ?? 0,
          g.dietary || "—",
          g.notes || "—",
        ]),
        styles: { fontSize: 8 },
        theme: "grid",
        headStyles: { fillColor: [130, 48, 90], textColor: 255 },
      });
      // @ts-expect-error plugin adds lastAutoTable
      const finalY = doc.lastAutoTable?.finalY;
      y = (typeof finalY === "number" ? finalY : y) + 6;
    }
    doc.save("rsvp-responses.pdf");
  };

  const cardClasses = (status: string) => {
    switch (status) {
      case "accepted":
        return "border-green-200 from-green-50 via-white to-white";
      case "pending":
        return "border-amber-200 from-amber-50 via-white to-white";
      case "invited":
        return "border-purple-200 from-purple-50 via-white to-white";
      case "declined":
        return "border-rose-200 from-rose-50 via-white to-white";
      default:
        return "border-gray-200 from-gray-50 via-white to-white";
    }
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-5xl pb-24 space-y-10">
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

        {loading && (
          <div className="text-sm text-gray-500">Loading guests...</div>
        )}

        {!loading && (
          <div className="space-y-8">
            {STATUS_ORDER.map((status) => {
              const list = grouped[status] || [];
              return (
                <div key={status} className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({list.length})
                  </h2>
                  {list.length === 0 && (
                    <div className="text-sm text-gray-500 border rounded-md px-3 py-4 bg-gray-50">
                      No {status} guests.
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
                            cardClasses(g.status || ""),
                          ].join(" ")}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="font-semibold text-gray-800">
                              {g.name || "Unnamed Guest"}
                            </div>
                            <span
                              className={[
                                "text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full",
                                g.status === "accepted" &&
                                  "bg-green-100 text-green-700",
                                g.status === "pending" &&
                                  "bg-amber-100 text-amber-700",
                                g.status === "invited" &&
                                  "bg-purple-100 text-purple-700",
                                g.status === "declined" &&
                                  "bg-rose-100 text-rose-700",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            >
                              {g.status}
                            </span>
                          </div>
                          <div className="mt-1 text-[14px] text-gray-600 flex flex-wrap gap-x-2 gap-y-0.5">
                            <span>{g.phone || "—"}</span>
                            <span>| Side: {g.side}</span>
                            {g.gender && (
                              <span>
                                |{" "}
                                {g.gender.charAt(0).toUpperCase() +
                                  g.gender.slice(1)}
                              </span>
                            )}
                            {(g.childCount ?? 0) > 0 && (
                              <span>| Children: {g.childCount}</span>
                            )}
                            {g.plusOnes ? <span>| +{g.plusOnes}</span> : null}
                          </div>
                          {(g.dietary || g.notes) && (
                            <div className="mt-1 text-[14px] text-gray-700 line-clamp-2">
                              {g.dietary && <span>Dietary: {g.dietary}</span>}
                              {g.dietary && g.notes && <span> | </span>}
                              {g.notes && <span>{g.notes}</span>}
                            </div>
                          )}
                          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-purple-200/40 to-transparent" />
                          <div className="mt-2 flex items-center justify-between">
                            {(g.childCount ?? 0) > 0 && (
                              <span className="text-[11px] text-purple-600 font-medium">
                                Family
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