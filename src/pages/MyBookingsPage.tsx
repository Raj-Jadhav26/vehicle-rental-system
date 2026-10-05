import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types';
import { bookingService } from '../services/api';
import { 
  Calendar, CheckCircle2, Clock, XCircle, AlertTriangle, 
  Car, Ban, ArrowRight, RefreshCw, FileText 
} from 'lucide-react';

interface MyBookingsPageProps {
  onBrowseVehicles: () => void;
  onRequireLogin: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onBrowseVehicles,
  onRequireLogin
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancelModalId, setCancelModalId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      setActionError(null);
      await bookingService.cancelBooking(id);
      setCancelModalId(null);
      await fetchBookings();
    } catch (err: any) {
      setActionError(err.message || 'Could not cancel booking.');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            CONFIRMED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            PENDING
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.bookingStatus === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Your Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            See your past and current bookings, prices, and cancel if needed
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold">
        {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              filterStatus === status
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your bookings...</div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Vehicle info & image */}
              <div className="flex items-center gap-4">
                <img
                  src={b.vehicleImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                  alt={b.vehicleName}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Booking #{b.id}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b.vehicleType || 'VEHICLE'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {b.vehicleName || 'Vehicle Rental'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {b.startDate} <strong className="text-slate-700">to</strong> {b.endDate}
                    </span>
                    <span className="font-semibold text-blue-600">({b.totalDays} days)</span>
                  </div>
                </div>
              </div>

              {/* Status and Price breakdown */}
              <div className="flex flex-wrap md:flex-col items-baseline md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="flex items-center gap-2">
                  {getStatusBadge(b.bookingStatus)}
                </div>

                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                  <span className="text-lg font-black text-slate-900">
                    ₹{b.totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Cancel action */}
                {(b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED') && (
                  <button
                    onClick={() => setCancelModalId(b.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition border border-rose-200 mt-1"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No bookings found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {filterStatus === 'ALL'
                ? "You have not booked any vehicles yet."
                : `No bookings found with status "${filterStatus}".`}
            </p>
          </div>
          <button
            onClick={onBrowseVehicles}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Find a Vehicle
          </button>
        </div>
      )}

      {/* Confirmation Modal for Cancel */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Ban className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-base">Cancel this booking?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to cancel Booking #{cancelModalId}?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCancelModalId(null)}
                className="py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={() => handleCancel(cancelModalId)}
                className="py-2 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
