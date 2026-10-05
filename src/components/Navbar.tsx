import React from 'react';
import { 
  Car, Calendar, LogOut, Compass, Plus, 
  Settings, Users, LayoutDashboard, BookmarkCheck 
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              if (currentUser?.role === 'ADMIN') {
                setCurrentPage('admin-dashboard');
              } else if (currentUser) {
                setCurrentPage('book-vehicle');
              } else {
                setCurrentPage('login');
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block">Rent&Ride</span>
              <p className="text-[11px] text-slate-500 -mt-1">
                {currentUser?.role === 'ADMIN' ? 'Admin Panel' : 'Easy Vehicle Rentals'}
              </p>
            </div>
          </div>

          {/* Nav Links Depending on Login Status & Role */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* If NOT logged in */}
            {!currentUser && (
              <div className="text-xs text-slate-400">
                Please log in to continue
              </div>
            )}

            {/* When USER logs in: exactly 2 sections: "Book Vehicle" and "Your Bookings" */}
            {currentUser && currentUser.role === 'USER' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('book-vehicle')}
                  className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                    currentPage === 'book-vehicle' || currentPage === 'vehicles' || currentPage === 'vehicle-details' || currentPage === 'booking'
                      ? 'text-blue-700 font-bold bg-blue-50 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Book Vehicle</span>
                </button>

                <button
                  onClick={() => setCurrentPage('your-bookings')}
                  className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                    currentPage === 'your-bookings' || currentPage === 'my-bookings'
                      ? 'text-blue-700 font-bold bg-blue-50 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                  <span>Your Bookings</span>
                </button>
              </div>
            )}

            {/* When ADMIN logs in: Dashboard, Manage Bookings, Add Vehicles, Users, Edit Vehicles */}
            {currentUser && currentUser.role === 'ADMIN' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'admin-dashboard'
                      ? 'text-amber-900 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentPage('manage-bookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'manage-bookings'
                      ? 'text-amber-900 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Manage Bookings</span>
                </button>

                <button
                  onClick={() => setCurrentPage('add-vehicle')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'add-vehicle'
                      ? 'text-amber-900 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add Vehicles</span>
                </button>

                <button
                  onClick={() => setCurrentPage('edit-vehicles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'edit-vehicles' || currentPage === 'manage-vehicles'
                      ? 'text-amber-900 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-amber-600" />
                  <span>Edit Vehicles</span>
                </button>

                <button
                  onClick={() => setCurrentPage('users')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    currentPage === 'users'
                      ? 'text-amber-900 bg-amber-50 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Users</span>
                </button>
              </div>
            )}
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('profile')}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100 transition border border-slate-200 text-left cursor-pointer"
                  title="View Profile & Settings"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
                    currentUser.role === 'ADMIN' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-xs font-semibold text-slate-800 truncate block max-w-[100px]">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      {currentUser && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium">
          {currentUser.role === 'USER' ? (
            <>
              <button
                onClick={() => setCurrentPage('book-vehicle')}
                className={`py-1 px-3 rounded-lg font-bold ${
                  currentPage === 'book-vehicle' || currentPage === 'vehicles' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
                }`}
              >
                Book Vehicle
              </button>
              <button
                onClick={() => setCurrentPage('your-bookings')}
                className={`py-1 px-3 rounded-lg font-bold ${
                  currentPage === 'your-bookings' || currentPage === 'my-bookings' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'
                }`}
              >
                Your Bookings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentPage('admin-dashboard')}
                className={`py-1 px-1.5 rounded font-semibold text-[11px] ${
                  currentPage === 'admin-dashboard' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('manage-bookings')}
                className={`py-1 px-1.5 rounded font-semibold text-[11px] ${
                  currentPage === 'manage-bookings' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-600'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setCurrentPage('add-vehicle')}
                className={`py-1 px-1.5 rounded font-semibold text-[11px] ${
                  currentPage === 'add-vehicle' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-600'
                }`}
              >
                Add
              </button>
              <button
                onClick={() => setCurrentPage('edit-vehicles')}
                className={`py-1 px-1.5 rounded font-semibold text-[11px] ${
                  currentPage === 'edit-vehicles' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-600'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setCurrentPage('users')}
                className={`py-1 px-1.5 rounded font-semibold text-[11px] ${
                  currentPage === 'users' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-600'
                }`}
              >
                Users
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
