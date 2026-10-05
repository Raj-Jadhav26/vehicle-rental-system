import React, { useState, useEffect } from 'react';
import { User, Vehicle, Booking } from './types';
import { authService, vehicleService, initializeStorage } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ManageVehiclesPage } from './pages/ManageVehiclesPage';
import { AddVehiclePage } from './pages/AddVehiclePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { ManageBookingsPage } from './pages/ManageBookingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('book-vehicle');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingPreDates, setBookingPreDates] = useState<{ start?: string; end?: string }>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Initialize storage & current user on mount
  useEffect(() => {
    initializeStorage();
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user?.role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
    } else if (user) {
      setCurrentPage('book-vehicle');
    } else {
      setCurrentPage('login');
    }
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles', err);
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    showNotification('Logged out successfully');
    setCurrentPage('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showNotification(`Welcome back, ${user.name}!`);
    if (user.role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('book-vehicle');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentPage('vehicle-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (vehicle: Vehicle, start?: string, end?: string) => {
    setSelectedVehicle(vehicle);
    setBookingPreDates({ start, end });
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSuccess = (booking: Booking) => {
    showNotification(`Booking #${booking.id} confirmed successfully! Total: ₹${booking.totalAmount.toLocaleString()}`);
    setCurrentPage('your-bookings');
    loadVehicles();
  };

  // Render Page Content based on login status & role
  const renderPage = () => {
    // 1. If not logged in, enforce authentication
    if (!currentUser) {
      if (currentPage === 'register') {
        return (
          <RegisterPage
            onSuccess={handleLoginSuccess}
            onGoToLogin={() => setCurrentPage('login')}
          />
        );
      }
      return (
        <LoginPage
          onSuccess={handleLoginSuccess}
          onGoToRegister={() => setCurrentPage('register')}
        />
      );
    }

    // 2. If Regular User is logged in (shows "Book Vehicle" & "Your Bookings")
    if (currentUser.role === 'USER') {
      switch (currentPage) {
        case 'book-vehicle':
        case 'vehicles':
        case 'home':
          return (
            <VehiclesPage
              vehicles={vehicles}
              onSelectVehicle={handleSelectVehicle}
              onBookNow={handleBookNow}
            />
          );

        case 'vehicle-details':
          if (!selectedVehicle) {
            return (
              <VehiclesPage
                vehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
                onBookNow={handleBookNow}
              />
            );
          }
          return (
            <VehicleDetailsPage
              vehicle={selectedVehicle}
              onBack={() => setCurrentPage('book-vehicle')}
              onProceedToBook={(v, s, e) => handleBookNow(v, s, e)}
            />
          );

        case 'booking':
          return (
            <BookingPage
              vehicle={selectedVehicle}
              currentUser={currentUser}
              initialStartDate={bookingPreDates.start}
              initialEndDate={bookingPreDates.end}
              onSuccess={handleBookingSuccess}
              onCancel={() => setCurrentPage('book-vehicle')}
              onRequireLogin={() => setCurrentPage('login')}
            />
          );

        case 'your-bookings':
        case 'my-bookings':
          return (
            <MyBookingsPage
              onBrowseVehicles={() => setCurrentPage('book-vehicle')}
              onRequireLogin={() => setCurrentPage('login')}
            />
          );

        case 'profile':
          return (
            <ProfilePage
              currentUser={currentUser}
              onLogout={handleLogout}
              setCurrentPage={setCurrentPage}
            />
          );

        default:
          return (
            <VehiclesPage
              vehicles={vehicles}
              onSelectVehicle={handleSelectVehicle}
              onBookNow={handleBookNow}
            />
          );
      }
    }

    // 3. If Admin is logged in (Dashboard, Manage Bookings, Add Vehicles, Edit Vehicles, Users)
    switch (currentPage) {
      case 'admin-dashboard':
      case 'home':
        return <AdminDashboardPage setCurrentPage={setCurrentPage} />;

      case 'manage-bookings':
        return <ManageBookingsPage />;

      case 'add-vehicle':
        return (
          <AddVehiclePage
            onVehicleAdded={loadVehicles}
            onGoToEditVehicles={() => setCurrentPage('edit-vehicles')}
          />
        );

      case 'edit-vehicles':
      case 'manage-vehicles':
        return (
          <ManageVehiclesPage
            vehicles={vehicles}
            onRefresh={loadVehicles}
          />
        );

      case 'users':
        return <AdminUsersPage />;

      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            onLogout={handleLogout}
            setCurrentPage={setCurrentPage}
          />
        );

      default:
        return <AdminDashboardPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in shadow-xl">
          <div className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
            notification.type === 'info'
              ? 'bg-blue-900 text-white border-blue-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page View */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={(page) => {
          if (currentUser?.role === 'ADMIN') {
            setCurrentPage('admin-dashboard');
          } else if (currentUser) {
            setCurrentPage(page === 'my-bookings' ? 'your-bookings' : 'book-vehicle');
          } else {
            setCurrentPage('login');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
