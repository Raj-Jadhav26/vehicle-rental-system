import React from 'react';
import { User } from '../types';
import { 
  User as UserIcon, Mail, Phone, Calendar, 
  ShieldCheck, LogOut, Car, Shield, Compass, BookmarkCheck
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  onLogout: () => void;
  setCurrentPage: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onLogout,
  setCurrentPage
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shadow-md ${
            currentUser.role === 'ADMIN' ? 'bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'
          }`}>
            {currentUser.name.charAt(0)}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full self-center sm:self-auto ${
                currentUser.role === 'ADMIN' 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {currentUser.role === 'ADMIN' ? (
                  <>
                    <Shield className="w-3 h-3 text-amber-600" />
                    Admin
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    Customer
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Account ID: <span className="font-mono font-bold text-slate-700">#{currentUser.id}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentUser.role === 'USER' ? (
          <>
            <button
              onClick={() => setCurrentPage('book-vehicle')}
              className="p-5 bg-white rounded-2xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-xs transition group cursor-pointer"
            >
              <Compass className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-slate-900 text-sm">Book a Vehicle</h4>
              <p className="text-xs text-slate-500 mt-0.5">See all cars, bikes, and scooters to rent.</p>
            </button>

            <button
              onClick={() => setCurrentPage('your-bookings')}
              className="p-5 bg-white rounded-2xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-xs transition group cursor-pointer"
            >
              <BookmarkCheck className="w-6 h-6 text-blue-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-slate-900 text-sm">Your Bookings</h4>
              <p className="text-xs text-slate-500 mt-0.5">See your bookings or cancel trips.</p>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage('admin-dashboard')}
              className="p-5 bg-white rounded-2xl border border-slate-200 text-left hover:border-amber-400 hover:shadow-xs transition group cursor-pointer"
            >
              <ShieldCheck className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-slate-900 text-sm">Admin Dashboard</h4>
              <p className="text-xs text-slate-500 mt-0.5">See your vehicles, money earned, and bookings.</p>
            </button>

            <button
              onClick={() => setCurrentPage('manage-bookings')}
              className="p-5 bg-white rounded-2xl border border-slate-200 text-left hover:border-amber-400 hover:shadow-xs transition group cursor-pointer"
            >
              <Calendar className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition" />
              <h4 className="font-bold text-slate-900 text-sm">Manage Bookings</h4>
              <p className="text-xs text-slate-500 mt-0.5">See, confirm, or cancel customer bookings.</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
