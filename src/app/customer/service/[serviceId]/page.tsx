"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowLeft, Camera } from "lucide-react";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";

export interface Package {
    name: string;
    price: string;
    features: string;
}

export interface Location {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
}

export interface Review {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Service {
    id: string;
    serviceName: string;
    category: string;
    description: string;
    capacity: string;
    rating: number;
    totalReviews: number;
    bookingCount: number;
    packages: Package[];
    location: Location;
    photos: string[];
    reviews: Review[];
    isActive: boolean;
    createdDate: string;
}

interface ApiResponse {
  code: number;
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const STORAGE_KEY = "wedeaseVendors";

export default function ServiceDetailsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params using React.use() - FIX FOR NEXT.JS 15
  const unwrappedParams = React.use(params);
  const serviceId = decodeURIComponent(unwrappedParams.serviceId);

  // Fetch service details from API
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching service details for decoded ID:', serviceId);
        
        const response = await fetch("http://localhost:5000/api/service/get-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: serviceId
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch service details: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('API Response:', result);
        
        if (result.success && result.data) {
          // Transform API data to match Service interface
          const apiService = result.data;
          const transformedService: Service = {
            id: apiService.serviceId,
            serviceName: apiService.serviceName,
            category: apiService.category,
            description: apiService.description || "No description available",
            capacity: apiService.capacity || "",
            rating: 4.5, // Default rating since it's not in API response
            totalReviews: 0, // Not in API response
            bookingCount: 0, // Not in API response
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            packages: apiService.packages?.map((pkg: any) => ({
              name: pkg.packageName,
              price: pkg.price.toString(),
              features: pkg.features
            })) || [],
            location: {
              address: apiService.address,
              city: apiService.city,
              district: apiService.district,
              province: apiService.state,
              country: apiService.country
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            photos: apiService.photos?.map((photo: any) => photo.imageUrl) || [],
            reviews: [], // Not in API response
            isActive: apiService.isActive,
            createdDate: apiService.createdAt
          };
          
          setService(transformedService);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to load service details");
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError(err instanceof Error ? err.message : "Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Rest of your component remains the same...
  // ---- SAVE TO LOCAL STORAGE ----
  const saveService = (status: "interested" | "pending") => {
    if (!service) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed : [];

      // Remove old entry if exists
      const filtered = existing.filter((s) => s.id !== service.id);

      // Build stored object
      const stored = {
        id: service.id,
        name: service.serviceName,
        provider: service.serviceName,
        category: service.category,
        price: service.packages.length > 0 
          ? Math.min(...service.packages.map(p => parseFloat(p.price) || 0))
          : 0,
        status,
        addedAt: new Date().toISOString(),
        contactNumber: "",
        email: "",
        website: "",
        location: `${service.location.city}, ${service.location.district}`,
      };

      const updated = [...filtered, stored];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      alert(`Service ${status === "pending" ? "booked" : "added to list"}!`);
    } catch (e) {
      console.error("Failed to save service:", e);
    }
  };

  // Loading state
  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/customer/service/browse"
            className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Services
          </Link>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading service details...</p>
            </div>
          </div>
        </div>
      </CustomerMainLayout>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <CustomerMainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            href="/customer/service/browse"
            className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Services
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              {error ? "Failed to Load Service" : "Service Not Found"}
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              {error || "Return to browse and select another service."}
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

  // Calculate starting price from packages
  const startingPrice = service.packages.length > 0 
    ? Math.min(...service.packages.map(p => parseFloat(p.price) || 0))
    : 0;

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
          {service.photos.length > 0 && (
            <div className="relative h-72 w-full">
              <img
                src={service.photos[0]}
                alt={service.serviceName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="text-3xl font-bold">{service.serviceName}</h1>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {service.category}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    <MapPin size={14} /> {service.location.city}, {service.location.district}
                  </span>
                  {service.capacity && (
                    <span className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      <Users size={14} /> Up to {service.capacity} guests
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
                  Category: {service.category}
                </span>
              </div>
              {startingPrice > 0 && (
                <div className="text-xl font-bold text-purple-600">
                  Starting from LKR {startingPrice.toLocaleString()}
                </div>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{service.description}</p>

            {/* Packages Section */}
            {service.packages.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Available Packages
                </h2>
                <div className="grid gap-4">
                  {service.packages.map((pkg, index) => (
                    <div
                      key={index}
                      className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                        <div className="text-lg font-bold text-purple-600">
                          LKR {parseInt(pkg.price).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{pkg.features}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {service.photos.length > 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                  <Camera size={18} className="text-purple-600" /> Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.photos.slice(1).map((photo, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`${service.serviceName} gallery image ${index + 1}`}
                        className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-purple-600" /> Location Details
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Address:</strong> {service.location.address}
                </p>
                <p className="text-gray-700">
                  <strong>City:</strong> {service.location.city}
                </p>
                <p className="text-gray-700">
                  <strong>District:</strong> {service.location.district}
                </p>
                <p className="text-gray-700">
                  <strong>Province:</strong> {service.location.province}
                </p>
                <p className="text-gray-700">
                  <strong>Country:</strong> {service.location.country}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="text-xs text-gray-500">
                Service added on {new Date(service.createdDate).toLocaleDateString()}
              </div>
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