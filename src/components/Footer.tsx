import React from 'react';
import { Car, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">Rent&Ride</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Rent clean and checked cars, bikes, and scooters at affordable daily rates with easy online booking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('book-vehicle')} className="hover:text-blue-400 transition cursor-pointer">
                  Book Vehicle
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('your-bookings')} className="hover:text-blue-400 transition cursor-pointer">
                  Your Bookings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('profile')} className="hover:text-blue-400 transition cursor-pointer">
                  My Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Service Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Why Choose Us</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Clean, checked, and safe vehicles</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Clear daily prices with no hidden charges</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Free cancellation up to 24 hours before pickup</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Rent&Ride. All rights reserved.</p>
          <p className="text-slate-500">
            Easy Online Vehicle Rentals
          </p>
        </div>
      </div>
    </footer>
  );
};
