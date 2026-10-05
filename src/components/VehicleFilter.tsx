import React from 'react';
import { Search, SlidersHorizontal, Car, Bike, Sparkles, X } from 'lucide-react';
import { VehicleType } from '../types';

interface VehicleFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (available: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalCount: number;
}

export const VehicleFilter: React.FC<VehicleFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  onlyAvailable,
  setOnlyAvailable,
  sortBy,
  setSortBy,
  totalCount
}) => {
  const typeButtons = [
    { id: 'ALL', label: 'All Vehicles', icon: Sparkles },
    { id: 'CAR', label: 'Cars', icon: Car },
    { id: 'BIKE', label: 'Bikes', icon: Bike },
    { id: 'SCOOTER', label: 'Scooters', icon: Bike }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search car or bike name (Honda, Royal Enfield...)"
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-56 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
          >
            <option value="featured">Best Matches</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Bottom row: Type Badges & Availability Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-2">
          {typeButtons.map(btn => {
            const Icon = btn.icon;
            const isSelected = selectedType === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedType(btn.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Available only toggle & count */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span>Available Only</span>
          </label>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{totalCount}</strong> vehicles
          </span>
        </div>
      </div>
    </div>
  );
};
