"use client";

import React, { useEffect, useState, useCallback } from "react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import Link from "next/link";
import { Trash2, CheckCircle2, Clock4, ArrowLeft, MapPin, Phone, Calendar, Mail, Globe } from "lucide-react";

const STORAGE_KEY = "wedeaseVendors";

type StoredService = {
  id: number;
  name: string;
  provider: string;
  category: string;
  price?: number;
  status: "interested" | "pending" | "confirmed" | "declined";
  addedAt: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  location?: string;
};

export default function ServicesSelectionPage() {
  const [items, setItems] = useState<StoredService[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        // Deduplicate by id (latest entry wins)
        const map = new Map<number, StoredService>();
        parsed.forEach((v: any) => {
          if (v && typeof v.id === "number") {
            map.set(v.id, {
              id: v.id,
              name: v.name || v.title || "Unnamed",
              provider: v.provider || "Unknown",
              category: v.category || "Other",
              price: typeof v.price === "number" ? v.price : undefined,
              status: ["interested", "pending", "confirmed", "declined"].includes(v.status) 
                ? (v.status === "booked" ? "pending" : v.status) 
                : "interested",
              addedAt: v.addedAt || new Date().toISOString(),
              contactNumber: v.contactNumber || "Not provided",
              email: v.email || undefined,
              website: v.website || undefined,
              location: v.location || "Not specified",
            });
          }
        });
        setItems(Array.from(map.values()));
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) load();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [load]);

  const persist = (next: StoredService[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const toggleStatus = (id: number) => {
    persist(
      items.map((it) =>
        it.id === id && it.status === "interested" // Only allow toggle if "interested"
          ? { ...it, status: "pending" } // Set to "pending" on first toggle 
          : it
      )
    );
  };

  const removeItem = (id: number) => {
    persist(items.filter((it) => it.id !== id));
  };

  const clearAll = () => {
    if (!items.length) return;
    if (confirm("Remove all saved services?")) {
      persist([]);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "confirmed":
        return { text: "Confirmed", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={12} /> };
      case "declined":
        return { text: "Declined", color: "bg-red-100 text-red-700", icon: <Trash2 size={12} /> };
      case "pending":
        return { text: "Pending", color: "bg-blue-100 text-blue-700", icon: <Clock4 size={12} /> };
      default:
        return { text: "Interested", color: "bg-amber-100 text-amber-700", icon: <Clock4 size={12} /> };
    }
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
              Service List
            </h1>
            <p className="text-gray-600"> 
              Services you added via Add to List or Book Now
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/customer/service/browse"
              className="inline-flex items-center text-sm px-3 py-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft size={14} className="mr-1" /> Browse More
            </Link>
            {!!items.length && (
              <button
                onClick={clearAll}
                className="inline-flex items-center text-sm px-3 py-2 rounded-lg border bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 size={14} className="mr-1" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full p-8 text-center text-sm text-gray-500">
              Loading...
            </div>
          )}

          {!loading && !items.length && (
            <div className="col-span-full p-10 text-center">
              <div className="text-4xl mb-2">🗂️</div>
              <p className="text-gray-600 mb-4">
                No services added yet. Browse and add some.
              </p>
              <Link
                href="/customer/service/browse"
                className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
              >
                Browse Services
              </Link>
            </div>
          )}

          {items.map((item) => {
            const statusInfo = getStatusDisplay(item.status);
            const canChangeStatus = item.status === "interested"; // Only allow change if interested
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.provider} • {item.category}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full text-[13px] font-medium px-2 py-1 ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.text}
                      </span>
                    </div>
                    {/* Contact Details */}
                    {item.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        <span>{item.contactNumber}</span>
                      </div>
                    )}
                    {item.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        <span>{item.email}</span>
                      </div>
                    )}
                    {item.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-500" />
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-500" />
                      <span>{item.location}</span>
                    </div>
                    {item.price && (
                      <div className="text-purple-600 font-medium">
                        LKR {item.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/customer/service/${item.id}`} // Adjust path as needed
                      className="flex-1 text-center px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                    >
                      View Details
                    </Link>
                    {canChangeStatus && (
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="px-3 py-2 rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 text-sm"
                      >
                        Book Now
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomerMainLayout>
  );
}