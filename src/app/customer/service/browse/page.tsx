"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import CustomerMainLayout from "@/components/CustomerLayout/CustomerMainLayout";
import CustomerSidebar from "@/components/CustomerLayout/CustomerSidebar";
import { Search, Filter, MapPin, Clock, Users, Phone, Mail, Globe } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define the Service interface based on your API response
interface Package {
  id: number;
  packageName: string;
  price: number;
  features: string;
  serviceId: string;
}

interface Photo {
  id: number;
  imageUrl: string;
  serviceId: string;
}

interface Vendor {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  contactNo: string;
  image: string | null;
}

interface Service {
  id: number;
  serviceId: string;
  serviceName: string;
  category: string;
  description: string;
  capacity: string;
  isActive: boolean;
  latitude: number;
  longitude: number;
  country: string;
  state: string;
  district: string;
  city: string;
  address: string;
  vendorId: string;
  packages: Package[];
  photos: Photo[];
  vendor: Vendor;
}

interface ApiResponse {
  code: number;
  success: boolean;
  message: string;
  data: Service[];
}

export default function ServiceBrowsePage() {
  // State for services
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state (shared with sidebar)
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300000]); 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Top bar state
  const [sortBy, setSortBy] = useState("priceAsc");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/service/all`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data) {
          setServices(result.data);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to load services");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Transform API data to match the expected format for filtering and display
  const transformedServices = useMemo(() => {
    return services.map(service => ({
      id: service.id, 
      serviceId: service.serviceId,
      title: service.serviceName,
      description: service.description,
      category: service.category,
      provider: `${service.vendor.firstName} ${service.vendor.lastName}`,
      // Use the lowest package price as the service price, or 0 if no packages
      price: service.packages.length > 0 ? Math.min(...service.packages.map(p => p.price)) : 0,
      rating: 4.5, // Default rating 
      location: `${service.city}, ${service.district}`,
      duration: "", 
      capacity: service.capacity || undefined,
      image: service.photos.length > 0 ? service.photos[0].imageUrl : undefined,
      contactDetails: {
        phone: service.vendor.contactNo,
        email: service.vendor.email,
        website: undefined 
      },
      // Include original service data for detailed view
      originalService: service
    }));
  }, [services]);

  const filtered = useMemo(() => {
    return transformedServices
      .filter(s => s.rating >= (minRating ?? 0))
      .filter(s => {
        const p = s.price ?? 0;
        return p >= priceRange[0] && p <= priceRange[1];
      })
      .filter(s =>
        selectedCategories.length ? selectedCategories.includes(s.category) : true
      )
      .filter(s =>
        (s.title + s.provider + s.category)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "priceAsc":
            return (a.price ?? 0) - (b.price ?? 0);
          case "priceDesc":
            return (b.price ?? 0) - (a.price ?? 0);
          case "ratingDesc":
            return b.rating - a.rating;
          case "ratingAsc":
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
  }, [transformedServices, selectedCategories, searchQuery, sortBy, minRating, priceRange]);

  /* const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    )); */

  // Loading state
  if (loading) {
    return (
      <CustomerMainLayout>
        <div className="min-h-screen flex">
          <CustomerSidebar
            activeSection="service"
            serviceFilters={{
              priceRange,
              setPriceRange,
              selectedCategories,
              setSelectedCategories,
              minRating,
              setMinRating
            }}
          />
          <main className="flex-1 p-8 pt-2 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </main>
        </div>
      </CustomerMainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <CustomerMainLayout>
        <div className="min-h-screen flex">
          <CustomerSidebar
            activeSection="service"
            serviceFilters={{
              priceRange,
              setPriceRange,
              selectedCategories,
              setSelectedCategories,
              minRating,
              setMinRating
            }}
          />
          <main className="flex-1 p-8 pt-2 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to load services
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </CustomerMainLayout>
    );
  }

  return (
    <CustomerMainLayout>
      <div className="min-h-screen flex">
        <CustomerSidebar
          activeSection="service"
          serviceFilters={{
            priceRange,
            setPriceRange,
            selectedCategories,
            setSelectedCategories,
            minRating,
            setMinRating
          }}
        />

        <main className="flex-1 p-8 pt-2">
          {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
                Browse Services
              </h1>
              <p className="text-gray-600">
                Find the perfect vendors for your special day
              </p>
            </div>

          {/* Top bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Active Filters */}
              <div className="flex items-start gap-4 text-sm flex-1">
                <div className="flex items-center gap-2 text-gray-600 pt-1">
                  <Filter size={16} className="text-purple-600" />
                  <span className="font-medium">Active Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(cat => (
                      <span
                        key={cat}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      All Categories
                    </span>
                  )}
                  {minRating !== null && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                      {minRating}★ & up
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    LKR {priceRange[0].toLocaleString()} - LKR{" "}
                    {priceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="ratingDesc">Rating: High to Low</option>
                  <option value="ratingAsc">Rating: Low to High</option> 
                </select>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search services or providers..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filtered.length}
              </span>{" "}
              services
              {searchQuery && (
                <span>
                  {" "}
                  for &quot;
                  <span className="font-semibold text-purple-600">
                    {searchQuery}
                  </span>
                  &quot;
                </span>
              )}
            </p>
          </div>

          {/* Services List */}
          <div className="space-y-6">
            {filtered.map(service => {
              // Find the original service to access packages and photos
              const originalService = services.find(s => s.serviceId === service.serviceId);
              
              return (
                <div
                  key={service.serviceId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image (clickable) */}
                    <Link
                      href={`/customer/service/${encodeURIComponent(service.serviceId)}`}
                      className="lg:w-80 h-64 lg:h-auto bg-gray-100 flex-shrink-0 group relative block"
                    >
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <div className="text-sm">No image</div>
                          </div>
                        </div>
                      )}
                      <span className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-xs tracking-wide py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {service.title}
                            </h3>
                            <p className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-1">
                              {service.category}
                            </p>
                            <p className="text-gray-600">
                              by{" "}
                              <span className="font-medium text-gray-800">
                                {service.provider}
                              </span>
                            </p>
                          </div>
                          {/* Rating (if available) */}
                          {/* <div className="flex items-center gap-1">
                            {renderStars(service.rating)}
                            <span className="text-xs font-medium text-gray-600 ml-1">
                              {service.rating.toFixed(1)}
                            </span>
                          </div> */}
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 mb-4 line-clamp-2 flex-1">
                          {service.description || "No description available"}
                        </p>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          {service.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-purple-600" />
                              {service.location}
                            </div>
                          )}
                          {service.duration && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-purple-600" />
                              {service.duration}
                            </div>
                          )}
                          {service.capacity && (
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-purple-600" />
                              Up to {service.capacity} guests
                            </div>
                          )}
                        </div>

                        {/* Packages */}
                        {originalService && originalService.packages.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Available Packages:</p>
                            <div className="flex flex-wrap gap-2">
                              {originalService.packages.map(pkg => (
                                <span
                                  key={pkg.id}
                                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {pkg.packageName}: LKR {pkg.price.toLocaleString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact Details */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          {service.contactDetails.phone && (
                            <div className="flex items-center gap-1">
                              <Phone size={14} className="text-purple-600" />
                              {service.contactDetails.phone}
                            </div>
                          )}
                          {service.contactDetails.email && (
                            <div className="flex items-center gap-1">
                              <Mail size={14} className="text-purple-600" />
                              {service.contactDetails.email}
                            </div>
                          )}
                          {service.contactDetails.website && (
                            <div className="flex items-center gap-1">
                              <Globe size={14} className="text-purple-600" />
                              <a
                                href={service.contactDetails.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            {service.price !== undefined && service.price > 0 && (
                              <div className="text-md font-bold text-purple-600">
                                Starting from LKR {service.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Link
                              href={`/customer/service/${encodeURIComponent(service.serviceId)}`}
                              className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* No Results */}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinRating(null);
                    setPriceRange([50, 300000]);
                    setSearchQuery("");
                  }}
                  className="bg-white text-purple-600 text-md font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Load More (placeholder) */}
          {filtered.length > 0 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Load More Services
              </button>
            </div>
          )}
        </main>
      </div>
    </CustomerMainLayout>
  );
}