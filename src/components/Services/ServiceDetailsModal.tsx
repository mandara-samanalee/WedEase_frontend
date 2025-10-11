import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCalendar, FaBox, FaTag, FaImages, FaTimes } from "react-icons/fa";
import { Service } from "./Types";
import Image from "next/image";

interface Customer {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string | null;
  city: string | null;
  distric: string | null;
  province: string | null;
  country: string | null;
  contactNo: string | null;
  image: string | null;
  createdAt: string;
  weddingEventId: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerId: string;
  serviceId: string;
}

interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  cancelledAt: string | null;
  customer: Customer;
  review?: Review;
}

interface ServiceReview {
  id: number;
  serviceId: string;
  customerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorService {
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
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  packages: Array<{
    id: number;
    packageName: string;
    price: number;
    features: string;
    serviceId: string;
  }>;
  photos: Array<{
    id: number;
    imageUrl: string;
    serviceId: string;
  }>;
  reviews?: ServiceReview[];
}

interface Props {
  open: boolean;
  service: Service | null;
  onClose: () => void;
  vendorService?: VendorService | null;
}

const ServiceDetailsModal: React.FC<Props> = ({ open, service, onClose, vendorService }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!open || !service) return null;

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));

  const formatFullAddress = (customer: Customer) => {
    const addressParts = [
      customer.address,
      customer.city,
      customer.distric,
      customer.province,
      customer.country
    ].filter(part => part && part.trim() !== '');

    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };

  const formatServiceAddress = () => {
    if (vendorService) {
      const addressParts = [
        vendorService.address,
        vendorService.city,
        vendorService.district,
        vendorService.state,
        vendorService.country
      ].filter(part => part && part.trim() !== '');
      return addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';
    }
    
    const addressParts = [
      service.location.address,
      service.location.city,
      service.location.district,
      service.location.province,
      service.location.country
    ].filter(part => part && part.trim() !== '');
    return addressParts.length > 0 ? addressParts.join(', ') : 'Not provided';
  };

  const validBookings = vendorService?.bookings?.filter(booking => 
    booking.customer && booking.status.toUpperCase() !== 'INTERESTED'
  ) || [];

  // Use reviews from API
  const apiReviews = vendorService?.reviews || [];
  const reviews = apiReviews.map(review => {
    // Find customer info from booking
    const booking = validBookings.find(b => b.id === review.bookingId);
    return {
      ...review,
      customerName: booking 
        ? `${booking.customer.firstName} ${booking.customer.lastName}`
        : 'Anonymous Customer',
    };
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : 0;

  const photos = vendorService?.photos || service.photos.map((url, idx) => ({ id: idx, imageUrl: url, serviceId: service.id }));
  const packages = vendorService?.packages || service.packages.map((pkg, idx) => ({
    id: idx,
    packageName: pkg.name,
    price: parseInt(pkg.price),
    features: pkg.features,
    serviceId: service.id
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-5 rounded-t-xl z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{vendorService?.serviceName || service.serviceName}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <FaTag />
                  {vendorService?.category || service.category}
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <FaMapMarkerAlt />
                  {vendorService?.city || service.location.city}, {vendorService?.district || service.location.district}
                </span>
                {totalReviews > 0 && (
                  <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-300" />
                    {averageRating.toFixed(1)} ({totalReviews})
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Service Gallery */}
          {photos.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaImages className="text-purple-600" />
                Service Gallery ({photos.length} photos)
              </h4>
              
              {/* Main Image */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-4 bg-gray-200">
                <Image
                  src={photos[selectedImageIndex].imageUrl}
                  alt={`${service.serviceName} - Photo ${selectedImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-purple-600 scale-105' 
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h4>
                <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-900">
                      {vendorService?.description || service.description || "No description available"}
                    </p>
                  </div>
                  {(vendorService?.capacity || service.capacity) && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Capacity</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {vendorService?.capacity || service.capacity}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Location</h4>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-purple-600 w-5 h-5 mt-1" />
                    <p className="text-sm text-gray-900">{formatServiceAddress()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{validBookings.length}</p>
                    <p className="text-xs text-gray-600">Total Bookings</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{packages.length}</p>
                    <p className="text-xs text-gray-600">Packages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Packages */}
          {packages.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBox className="text-purple-600" />
                Pricing Packages
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="border-2 border-purple-200 rounded-lg p-5 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-bold text-lg text-gray-900">{pkg.packageName}</h5>
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full">
                        <span className="text-sm font-bold">LKR {pkg.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{pkg.features}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings & Reviews Section */}
          {totalReviews > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaStar className="text-yellow-500 w-6 h-6" />
                    Ratings & Reviews
                  </h4>
                  <p className="text-sm text-gray-600">See what customers are saying about this service</p>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                    <FaStar className="text-yellow-500 w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(averageRating)}
                  </div>
                  <p className="text-xs text-gray-600">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg p-5 shadow-sm border border-yellow-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-purple-100 rounded-full p-2">
                            <FaUser className="text-purple-600 w-4 h-4" />
                          </div>
                          <h6 className="font-semibold text-gray-900">{review.customerName}</h6>
                        </div>
                        <div className="flex items-center gap-2 ml-10">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed ml-10 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
              <span>Booking Details</span>
              {validBookings.length > 0 && (
                <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
                  {validBookings.length} {validBookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              )}
            </h4>

            {validBookings.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaCalendar className="text-2xl text-gray-400" />
                </div>
                <h5 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Yet</h5>
                <p className="text-gray-500">This service hasn&apos;t received any bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {validBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    {/* Customer Info */}
                    <div className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <FaUser className="text-purple-600 w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 text-lg">
                              {booking.customer.firstName} {booking.customer.lastName}
                            </h5>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                          </span>
                          {booking.review && (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <FaStar className="w-3 h-3" />
                              Reviewed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400 w-4 h-4" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm font-medium text-gray-900">{booking.customer.email}</p>
                            </div>
                          </div>
                          
                          {booking.customer.contactNo ? (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-400 w-4 h-4" />
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{booking.customer.contactNo}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-400 w-4 h-4" />
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-500 italic">Not provided</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <FaCalendar className="text-gray-400 w-4 h-4" />
                            <div>
                              <p className="text-xs text-gray-500">Booking Date</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(booking.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {formatFullAddress(booking.customer) ? (
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="text-gray-400 w-4 h-4 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Customer Address</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatFullAddress(booking.customer)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="text-gray-400 w-4 h-4 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500">Customer Address</p>
                                <p className="text-sm font-medium text-gray-500 italic">Not provided</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Confirmation Status */}
                      {(booking.confirmedAt || booking.cancelledAt) && (
                        <div className="mt-4">
                          {booking.confirmedAt && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">
                                <strong>✓ Confirmed on:</strong> {new Date(booking.confirmedAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {booking.cancelledAt && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800">
                                <strong>✗ Declined on:</strong> {new Date(booking.cancelledAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;