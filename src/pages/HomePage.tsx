import React from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { 
  Car, Bike, ShieldCheck, CheckCircle2, ArrowRight, 
  Calendar, Clock, Award, ChevronRight, Compass, Sparkles
} from 'lucide-react';

interface HomePageProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
  setCurrentPage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  vehicles,
  onSelectVehicle,
  onBookNow,
  setCurrentPage
}) => {
  // Show top 3 featured vehicles
  const featuredVehicles = vehicles.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Fast, Easy & Reliable Vehicle Rentals</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Rent Your Vehicle <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
              Easily & Instantly
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Choose from our fleet of verified cars, motorbikes, and scooters. Transparent per-day pricing, instant online booking, and zero hidden charges.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('vehicles')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Browse All Vehicles</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('my-bookings')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>My Bookings</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE BENEFITS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified & Insured</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every car, bike, and scooter in our fleet undergoes regular maintenance and includes standard insurance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Transparent Daily Rates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clear per-day prices with no hidden convenience fees. Exact totals are calculated upfront before you book.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Online Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your pickup and return dates, confirm reservation in seconds, and pick up your vehicle smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-slate-100/60 border-y border-slate-200 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rent your vehicle in 3 straightforward steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-base font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Select Vehicle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by Cars, Bikes, or Scooters to find the best match for your trip.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-base font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Choose Dates</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pick your start and return dates to preview automatic total cost calculation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-base font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Confirm & Ride</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive instant confirmation with full booking details and easy cancellation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED FLEET */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Fleet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Popular vehicles ready for immediate booking
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('vehicles')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({vehicles.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to Rent a Vehicle?
            </h3>
            <p className="text-xs text-slate-300 max-w-md">
              Browse our complete catalog and book your ride today with free cancellation.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('vehicles')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 transition cursor-pointer"
          >
            <span>Explore All Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
