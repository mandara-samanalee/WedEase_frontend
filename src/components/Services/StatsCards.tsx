import React from "react";
import { GiDiamondRing } from "react-icons/gi";
import { FaEye, FaUsers, FaStar } from "react-icons/fa";
import { Service } from "./Types";

interface Props {
  services: Service[];
}

const StatsCards: React.FC<Props> = ({ services }) => {
  // Calculate total bookings from all services
  const totalBookings = services.reduce((sum, service) => sum + service.bookingCount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Total Services</p>
            <p className="text-2xl font-bold">{services.length}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <GiDiamondRing className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Active Services</p>
            <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <FaEye className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <FaUsers className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm">Avg Rating</p>
            <p className="text-2xl font-bold">
              {services.length > 0 ? (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1) : '0.0'}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg">
            <FaStar className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;