import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilter } from '../components/VehicleFilter';
import { Car, Frown, Sparkles } from 'lucide-react';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  vehicles,
  onSelectVehicle,
  onBookNow
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Type filter
      if (selectedType !== 'ALL' && v.type !== selectedType) {
        return false;
      }
      // Availability filter
      if (onlyAvailable && !v.availability) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = v.vehicleName.toLowerCase().includes(query);
        const matchBrand = v.brand.toLowerCase().includes(query);
        const matchModel = v.model.toLowerCase().includes(query);
        const matchDesc = v.description.toLowerCase().includes(query);
        return matchName || matchBrand || matchModel || matchDesc;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'name-asc') return a.vehicleName.localeCompare(b.vehicleName);
      return 0; // featured
    });
  }, [vehicles, searchTerm, selectedType, onlyAvailable, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Book Vehicle
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Choose a car, bike, or scooter, check details, and book your ride easily
        </p>
      </div>

      {/* Filter Component */}
      <VehicleFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalCount={filteredVehicles.length}
      />

      {/* Grid of Vehicles */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onSelect={onSelectVehicle}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Frown className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No vehicles found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try searching with a different name or clear filters to see all vehicles.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('ALL');
              setOnlyAvailable(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            Show All Vehicles
          </button>
        </div>
      )}
    </div>
  );
};
