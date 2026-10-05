import React, { useState } from 'react';
import { Vehicle, VehicleType } from '../types';
import { vehicleService } from '../services/api';
import { Plus, Car, Bike, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AddVehiclePageProps {
  onVehicleAdded: () => void;
  onGoToEditVehicles: () => void;
}

export const AddVehiclePage: React.FC<AddVehiclePageProps> = ({
  onVehicleAdded,
  onGoToEditVehicles
}) => {
  const initialFormState: Omit<Vehicle, 'id'> = {
    vehicleName: '',
    brand: '',
    type: 'CAR',
    model: '',
    registrationNumber: '',
    pricePerDay: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: '',
    seatingCapacity: 5,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC'
  };

  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sample photos for fast selection
  const sampleImages = [
    { label: 'Sedan Car', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80' },
    { label: 'SUV Car', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80' },
    { label: 'Compact Car', url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80' },
    { label: 'Bike', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80' },
    { label: 'Scooter', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleName.trim()) {
      setError('Please enter a vehicle name.');
      return;
    }
    if (!formData.brand.trim()) {
      setError('Please enter the brand name.');
      return;
    }
    if (!formData.registrationNumber.trim()) {
      setError('Please enter the number plate.');
      return;
    }
    if (formData.pricePerDay <= 0) {
      setError('Price per day must be more than zero.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await vehicleService.create(formData);
      setSuccess(true);
      onVehicleAdded();
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err.message || 'Could not add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Vehicle</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add a new car, bike, or scooter to rent
          </p>
        </div>

        <button
          onClick={onGoToEditVehicles}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <span>See All Vehicles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Vehicle added successfully!</span>
          </div>
          <button
            onClick={onGoToEditVehicles}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            See Vehicles →
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Basic Info */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vehicle Name *
              </label>
              <input
                type="text"
                required
                value={formData.vehicleName}
                onChange={e => setFormData({ ...formData, vehicleName: e.target.value })}
                placeholder="e.g. Honda City"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Brand / Company *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Honda"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Vehicle Type *
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as VehicleType })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="CAR">Car</option>
                <option value="BIKE">Motorcycle / Bike</option>
                <option value="SCOOTER">Scooter</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Model / Year
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g. 2024 Automatic"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number Plate *
              </label>
              <input
                type="text"
                required
                value={formData.registrationNumber}
                onChange={e => setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. MH-12-AB-1234"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Price Per Day (₹) *
              </label>
              <input
                type="number"
                required
                min="100"
                step="50"
                value={formData.pricePerDay}
                onChange={e => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* More Details */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            More Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seats
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.seatingCapacity || 5}
                onChange={e => setFormData({ ...formData, seatingCapacity: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Fuel
              </label>
              <select
                value={formData.fuelType || 'PETROL'}
                onChange={e => setFormData({ ...formData, fuelType: e.target.value as 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gear Type
              </label>
              <select
                value={formData.transmission || 'AUTOMATIC'}
                onChange={e => setFormData({ ...formData, transmission: e.target.value as 'AUTOMATIC' | 'MANUAL' })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photo & Description */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Photo & Description
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Photo Link (URL)
              </label>
              <input
                type="url"
                required
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Sample Photos:</span>
                {sampleImages.map(img => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition cursor-pointer"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key features, comfort, luggage space..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setFormData(initialFormState)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Adding...' : 'Save Vehicle'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
