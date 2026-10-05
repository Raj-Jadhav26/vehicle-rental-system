import React from 'react';
import { Car, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  onGoVehicles: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome, onGoVehicles }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
        <Car className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl sm:text-5xl font-black text-slate-900">404</span>
        <h1 className="text-xl font-bold text-slate-800">Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          The vehicle or page you are searching for might have taken another route or was moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={onGoHome}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          onClick={onGoVehicles}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
        >
          Browse Fleet
        </button>
      </div>
    </div>
  );
};
