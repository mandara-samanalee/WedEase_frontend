"use client";

import React, { useMemo, use } from "react";
import Link from "next/link";
import { MapPin, Clock, Users, ArrowLeft, /* Star, */ Camera } from "lucide-react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import { getServiceById } from "@/data/services";

const STORAGE_KEY = "wedeaseVendors";

/* const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
    ))}
    <span className="text-xs font-medium text-gray-600 ml-1">{rating.toFixed(1)}</span>
  </div>
); */

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // unwrap the params
  const service = useMemo(() => getServiceById(Number(id)), [id]);

  if (!service) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/customer/service/browse"
            className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft size={16} className="mr-2" /> Back
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Return to browse and select another service.
            </p>
            <Link
              href="/customer/service/browse"
              className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  // ---- SAVE TO LOCAL STORAGE ----
  const saveService = (status: "interested" | "pending") => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed : [];

      // Remove old entry if exists
      const filtered = existing.filter((s: any) => s.id !== service.id);

      // Build stored object
      const stored = {
        id: service.id,
        name: service.title,
        provider: service.provider,
        category: service.category,
        price: service.price,
        status,
        addedAt: new Date().toISOString(),
        contactNumber: service.contactDetails.phone,
        email: service.contactDetails.email,
        website: service.contactDetails.website,
        location: service.location,
      };

      const updated = [...filtered, stored];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      alert(`Service ${status === "pending" ? "booked" : "added to list"}!`);
    } catch (e) {
      console.error("Failed to save service:", e);
    }
  };

  return (
    <CustomerMainLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <Link
          href="/customer/service/browse"
          className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Services
        </Link>

        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
          {service.image && (
            <div className="relative h-72 w-full">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="text-3xl font-bold">{service.title}</h1>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {service.category}
                  </span>
                  {service.location && (
                    <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <MapPin size={14} /> {service.location}
                    </span>
                  )}
                  {service.duration && (
                    <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Clock size={14} /> {service.duration}
                    </span>
                  )}
                  {service.capacity && (
                    <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Users size={14} /> Up to {service.capacity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-purple-700">
                  Provider: {service.provider}
                </span>
              </div>
              {service.price && (
                <div className="text-2xl font-bold text-purple-600">
                  LKR {service.price.toLocaleString()}
                </div>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{service.description}</p>

            {service.includes?.length ? (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900">
                  Included
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-md px-3 py-2"
                    >
                      <span className="text-purple-600 font-bold mt-[1px]">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {service.gallery?.length ? (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <Camera size={18} className="text-purple-600" /> Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.gallery.map((g) => (
                    <div
                      key={g}
                      className="relative group rounded-lg overflow-hidden"
                    >
                      <img
                        src={g}
                        alt=""
                        className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="text-xs text-gray-500"></div>
              <div className="flex gap-3">
                <button
                  onClick={() => saveService("pending")}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
                >
                  Book Now
                </button>
                <button
                  onClick={() => saveService("interested")}
                  className="px-5 py-2 rounded-lg border border-purple-300 text-purple-700 text-sm font-medium hover:bg-purple-50"
                >
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerMainLayout>
  );
}