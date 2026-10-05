import React, { useState } from 'react';
import { Vehicle } from '../types';
import { 
  ArrowLeft, CheckCircle2, XCircle, Calendar, ShieldCheck, 
  Fuel, Users, Gauge, Info, ArrowRight, Star 
} from 'lucide-react';

interface VehicleDetailsPageProps {
  vehicle: Vehicle;
  onBack: () => void;
  onProceedToBook: (vehicle: Vehicle, startDate?: string, endDate?: string) => void;
}

export const VehicleDetailsPage: React.FC<VehicleDetailsPageProps> = ({
  vehicle,
  onBack,
  onProceedToBook
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const threeDaysStr = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(threeDaysStr);

  // Calculate days & amount
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const calculatedDays = isNaN(diffTime) ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isValidRange = calculatedDays > 0;
  const calculatedTotal = isValidRange ? calculatedDays * vehicle.pricePerDay : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Vehicles</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image and Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <div className="relative h-80 sm:h-96 w-full bg-slate-100">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.vehicleName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-slate-900 shadow-sm uppercase tracking-wider">
                  {vehicle.type}
                </span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900/80 text-white shadow-sm backdrop-blur-xs">
                  {vehicle.registrationNumber}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                {vehicle.availability ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available Now
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-500 text-white px-3 py-1 rounded-full shadow-sm">
                    <XCircle className="w-3.5 h-3.5" />
                    Already Booked
                  </span>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {vehicle.brand} • {vehicle.model}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 (48 Reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {vehicle.vehicleName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {vehicle.description}
              </p>

              {/* Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Seats</span>
                  <span className="text-xs font-bold text-slate-800">{vehicle.seatingCapacity || 5} Seats</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                  <Fuel className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuel</span>
                  <span className="text-xs font-bold text-slate-800">{vehicle.fuelType || 'Petrol'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                  <Gauge className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Gear Type</span>
                  <span className="text-xs font-bold text-slate-800">{vehicle.transmission || 'Automatic'}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Insurance</span>
                  <span className="text-xs font-bold text-slate-800">Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price & Date Select */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Price Per Day
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-slate-900">₹</span>
                <span className="text-4xl font-black text-slate-900">
                  {vehicle.pricePerDay.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ day</span>
              </div>
            </div>

            {/* Date Selectors */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Dates
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Days:</span>
                <span className="font-bold text-slate-900">{calculatedDays} day(s)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Price per day:</span>
                <span>₹{vehicle.pricePerDay.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Price:</span>
                <span className="text-xl font-extrabold text-blue-600">
                  ₹{calculatedTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => onProceedToBook(vehicle, startDate, endDate)}
              disabled={!vehicle.availability || !isValidRange}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition ${
                vehicle.availability && isValidRange
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span>{vehicle.availability ? 'Continue to Book' : 'Not Available'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Free cancellation up to 24 hours before pickup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
