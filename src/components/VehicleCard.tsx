import React from 'react';
import { Vehicle } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, Zap, Fuel, Users } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onBookNow
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CAR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BIKE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SCOOTER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image & Badges Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={vehicle.vehicleName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback placeholder image if Unsplash fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80';
          }}
        />

        {/* Vehicle Type Pill */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs tracking-wider uppercase ${getTypeColor(vehicle.type)}`}>
            {vehicle.type}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {vehicle.availability ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-500/90 text-white px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              <XCircle className="w-3 h-3" />
              Booked
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-sm border border-slate-700/50">
          <span className="text-xs font-normal text-slate-300">₹</span>
          <span className="text-base font-bold">{vehicle.pricePerDay.toLocaleString()}</span>
          <span className="text-[11px] text-slate-300"> / day</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {vehicle.brand}
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {vehicle.model}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition leading-snug">
            {vehicle.vehicleName}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.seatingCapacity || 5} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.fuelType || 'Petrol'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => onSelect(vehicle)}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center cursor-pointer"
          >
            See Details
          </button>

          <button
            onClick={() => onBookNow(vehicle)}
            disabled={!vehicle.availability}
            className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 shadow-xs ${
              vehicle.availability
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>{vehicle.availability ? 'Book Now' : 'Not Available'}</span>
            {vehicle.availability && <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};
