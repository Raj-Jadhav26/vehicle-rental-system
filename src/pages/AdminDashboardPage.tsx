import React, { useState, useEffect } from 'react';
import { DashboardStats, Booking, User } from '../types';
import { adminService } from '../services/api';
import { 
  Car, Calendar, DollarSign, Clock, CheckCircle2, 
  ArrowUpRight, Users, Plus, Settings, RefreshCw 
} from 'lucide-react';

interface AdminDashboardPageProps {
  setCurrentPage: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setCurrentPage }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await adminService.getDashboardStats();
      const allBookings = await adminService.getAllBookings();
      setStats(statsData);
      setRecentBookings(allBookings.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: number, status: any) => {
    try {
      await adminService.updateBookingStatus(id, status);
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            See your vehicles, bookings, and money earned
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 1. ESSENTIAL METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Vehicles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Vehicles</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.totalVehicles : '-'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Vehicles in list</span>
        </div>

        {/* Available Fleet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats ? stats.availableVehicles : '-'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Ready to rent</span>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.totalBookings : '-'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Total orders</span>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats ? stats.pendingBookings : '-'}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Needs your check</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Money Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{stats ? stats.totalRevenue.toLocaleString() : '-'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">From all rentals</span>
        </div>
      </div>

      {/* 2. ADMIN SECTIONS SHORTCUTS */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Admin Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Section 1: Manage Bookings */}
          <div 
            onClick={() => setCurrentPage('manage-bookings')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3">Manage Bookings</h3>
            <p className="text-xs text-slate-500 mt-1">See, confirm, or cancel customer bookings.</p>
          </div>

          {/* Section 2: Add Vehicles */}
          <div 
            onClick={() => setCurrentPage('add-vehicle')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Plus className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3">Add Vehicles</h3>
            <p className="text-xs text-slate-500 mt-1">Add a new car, bike, or scooter to rent.</p>
          </div>

          {/* Section 3: Edit Vehicles */}
          <div 
            onClick={() => setCurrentPage('edit-vehicles')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Settings className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3">Edit Vehicles</h3>
            <p className="text-xs text-slate-500 mt-1">Change prices, details, or availability.</p>
          </div>

          {/* Section 4: Users */}
          <div 
            onClick={() => setCurrentPage('users')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-xs transition cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-3">Users</h3>
            <p className="text-xs text-slate-500 mt-1">See all customer and admin accounts.</p>
          </div>
        </div>
      </div>

      {/* 3. RECENT BOOKINGS SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">New bookings that need your review</p>
          </div>
          <button
            onClick={() => setCurrentPage('manage-bookings')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            See All Bookings →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Dates</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">#{b.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{b.userName}</td>
                    <td className="py-3 px-3 text-slate-700">{b.vehicleName}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {b.startDate} to {b.endDate} ({b.totalDays}d)
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ₹{b.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        b.bookingStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        b.bookingStatus === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className="text-[11px] py-1 px-2 border border-slate-200 rounded-lg bg-white font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRM</option>
                        <option value="COMPLETED">COMPLETE</option>
                        <option value="CANCELLED">CANCEL</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
