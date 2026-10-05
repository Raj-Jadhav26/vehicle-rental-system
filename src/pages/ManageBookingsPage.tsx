import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types';
import { adminService } from '../services/api';
import { 
  Calendar, Search, CheckCircle2, Clock, XCircle, 
  RefreshCw, Filter, User as UserIcon, Car 
} from 'lucide-react';

export const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: BookingStatus) => {
    try {
      await adminService.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, bookingStatus: newStatus } : b));
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchCustomer = b.userName?.toLowerCase().includes(q) || b.userEmail?.toLowerCase().includes(q);
      const matchVehicle = b.vehicleName?.toLowerCase().includes(q);
      const matchId = String(b.id).includes(q);
      return matchCustomer || matchVehicle || matchId;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Manage Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            See, confirm, finish, or cancel customer bookings
          </p>
        </div>

        <button
          onClick={fetchAllBookings}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Controls: Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, booking #, or vehicle..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold w-full sm:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Reserved Vehicle</th>
                <th className="py-3 px-4">Rental Duration</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    #{b.id}
                    <span className="text-[10px] text-slate-400 block font-normal">{b.createdAt}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{b.userName || `User #${b.userId}`}</div>
                    <div className="text-[11px] text-slate-500">{b.userEmail}</div>
                    <div className="text-[10px] text-slate-400">{b.userPhone}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{b.vehicleName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{b.vehicleBrand}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {b.startDate} → {b.endDate}
                    </div>
                    <span className="text-blue-600 font-bold text-[10px]">
                      {b.totalDays} day(s)
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{b.totalAmount.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : b.bookingStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <select
                      value={b.bookingStatus}
                      onChange={(e) => handleStatusUpdate(b.id, e.target.value as BookingStatus)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No bookings matched your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
