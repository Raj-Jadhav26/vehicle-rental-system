import React, { useState, useEffect } from 'react';
import { Vehicle, User, Booking } from '../types';
import { bookingService } from '../services/api';
import { 
  Calendar, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck, 
  Car, Clock, User as UserIcon, Phone, Mail, CheckCircle2 
} from 'lucide-react';

interface BookingPageProps {
  vehicle: Vehicle | null;
  currentUser: User | null;
  initialStartDate?: string;
  initialEndDate?: string;
  onSuccess: (booking: Booking) => void;
  onCancel: () => void;
  onRequireLogin: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  vehicle,
  currentUser,
  initialStartDate,
  initialEndDate,
  onSuccess,
  onCancel,
  onRequireLogin
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultStart = initialStartDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const defaultEnd = initialEndDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Recalculate days and total whenever dates or vehicle changes
  useEffect(() => {
    if (!startDate || !endDate || !vehicle) {
      setTotalDays(0);
      setTotalAmount(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError('Pickup date cannot be in the past.');
      setTotalDays(0);
      setTotalAmount(0);
      return;
    }

    if (end <= start) {
      setError('Return date must be after the pickup date.');
      setTotalDays(0);
      setTotalAmount(0);
      return;
    }

    setError(null);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalDays(days);
    setTotalAmount(days * vehicle.pricePerDay);
  }, [startDate, endDate, vehicle]);

  if (!vehicle) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-slate-600 text-sm">No vehicle chosen for booking.</p>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Choose a Vehicle
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (error || totalDays <= 0) {
      return;
    }

    if (!agreedTerms) {
      setError('Please tick the box to agree to the rental terms.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const booking = await bookingService.create({
        vehicleId: vehicle.id,
        startDate,
        endDate
      });
      onSuccess(booking);
    } catch (err: any) {
      setError(err.message || 'Could not place booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Confirm Your Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Check your dates and price, then click confirm to book.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Form: Dates & Details */}
        <div className="md:col-span-7 space-y-6">
          {/* 1. Dates Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Booking Dates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Pickup & return time: <strong>9:00 AM</strong></span>
            </div>
          </div>

          {/* 2. Customer Profile Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>Your Details</span>
            </h3>

            {currentUser ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
                    <span className="font-bold text-slate-800">{currentUser.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                    <span className="font-medium text-slate-700">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="font-medium text-slate-700">{currentUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Role</span>
                    <span className="font-bold text-blue-600">{currentUser.role}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Please log in to complete your booking.</span>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          {/* 3. Agreement Terms */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span>
                I agree to show my driving license during pickup and follow road rules.
              </span>
            </label>
          </div>
        </div>

        {/* Right Summary: Vehicle & Price */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-bold text-slate-900 text-sm">Booking Summary</h3>

            {/* Vehicle mini card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.vehicleName}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {vehicle.brand} • {vehicle.type}
                </span>
                <h4 className="font-bold text-slate-900 text-xs truncate">
                  {vehicle.vehicleName}
                </h4>
                <p className="text-[11px] font-mono text-slate-500">
                  {vehicle.registrationNumber}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Price per day:</span>
                <span className="font-medium text-slate-900">₹{vehicle.pricePerDay.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Total Days:</span>
                <span className="font-bold text-slate-900">{totalDays} day(s)</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Taxes & Insurance:</span>
                <span className="text-emerald-600 font-bold">Free (Included)</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Price:</span>
                <span className="text-2xl font-black text-blue-600">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !!error || totalDays <= 0 || !currentUser}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md ${
                !isSubmitting && !error && totalDays > 0 && currentUser
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking (Pay When You Pick Up)</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-slate-400">
              No prepayment needed. Pay when picking up your vehicle.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
