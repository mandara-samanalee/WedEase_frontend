// components/Services/ServiceDetailsModal.tsx
import React from "react";
import { FaStar } from "react-icons/fa";
import { Service } from "./Types";
import BookingDetails, { Booking } from "./BookingDetails";

interface Props {
  open: boolean;
  service: Service | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  bookings: Booking[];
}

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
    />
  ));

const ServiceDetailsModal: React.FC<Props> = ({ open, service, onClose, onEdit, bookings }) => {
  if (!open || !service) return null;

  // Filter bookings for this specific service
  const serviceBookings = bookings.filter(booking => 
    booking.serviceId === service.id && booking.status.toUpperCase() !== "INTERESTED"
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{service.serviceName}</h3>
              <p className="text-purple-600 font-medium">{service.category}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{service.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <p className="text-gray-900">{service.capacity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(service.rating)}</div>
                  <span className="text-gray-600">
                    {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Bookings</label>
                <p className="text-gray-900 font-semibold">{serviceBookings.length}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
            <p className="text-gray-900">
              {service.location.address && `${service.location.address}, `}
              {service.location.city && `${service.location.city}, `}
              {service.location.district && `${service.location.district}, `}
              {service.location.province && `${service.location.province}, `}
              {service.location.country || 'Location not specified'}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Packages</h4>
            {service.packages.length === 0 ? (
              <p className="text-gray-500 italic">No packages available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.packages.map((pkg, index) => (
                  <div key={index} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                      <span className="text-lg font-bold text-purple-700">
                        LKR {parseInt(pkg.price || '0').toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{pkg.features}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h4>
            <BookingDetails bookings={serviceBookings} serviceName={service.serviceName} />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">All Reviews</h4>
            {service.reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h6 className="font-medium text-gray-900">{review.customerName}</h6>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button onClick={() => onEdit(service.id)} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;