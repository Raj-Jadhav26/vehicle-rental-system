import axios, { AxiosInstance } from 'axios';
import { User, Vehicle, Booking, DashboardStats } from '../types';
import { INITIAL_USERS, INITIAL_VEHICLES, INITIAL_BOOKINGS } from './mockData';

// Central API configuration using Vite environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create configured Axios instance
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor to inject JWT / Bearer token if available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vrs_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// LOCAL STORAGE BACKEND EMULATOR (Zero-Setup)
// Mirrors exact Spring Boot REST contracts
// ==========================================
const USERS_KEY = 'vrs_users';
const VEHICLES_KEY = 'vrs_vehicles';
const BOOKINGS_KEY = 'vrs_bookings';
const CURRENT_USER_KEY = 'vrs_current_user';
const API_MODE_KEY = 'vrs_api_mode'; // 'mock' or 'springboot'

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(data) as T;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

// Initialize seed data if empty
export function initializeStorage() {
  getStored<User[]>(USERS_KEY, INITIAL_USERS);
  getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
}

export function getApiMode(): 'mock' | 'springboot' {
  return (localStorage.getItem(API_MODE_KEY) as 'mock' | 'springboot') || 'mock';
}

export function setApiMode(mode: 'mock' | 'springboot') {
  localStorage.setItem(API_MODE_KEY, mode);
}

// ---------------- AUTH SERVICES ----------------
export const authService = {
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user: User | null, token?: string) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem('vrs_auth_token', token || `mock_jwt_${user.id}_${user.role}`);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('vrs_auth_token');
    }
  },

  async login(email: string, password: string):Promise<{ user: User; token: string }> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.post('/auth/login', { email, password });
        const { user, token } = res.data;
        authService.setCurrentUser(user, token);
        return { user, token };
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Login failed. Ensure Spring Boot is running on port 8080.');
      }
    }

    // Local storage verification
    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('User not found with this email');
    }
    if (user.password && user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const token = `jwt_token_${user.id}_${Date.now()}`;
    const safeUser = { ...user };
    delete safeUser.password;
    authService.setCurrentUser(safeUser, token);
    return { user: safeUser, token };
  },

  async register(userData: Omit<User, 'id'>): Promise<{ user: User; token: string }> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.post('/auth/register', userData);
        const { user, token } = res.data;
        authService.setCurrentUser(user, token);
        return { user, token };
      } catch (err: any) {
        throw new Error(err.response?.data?.message || 'Registration failed');
      }
    }

    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Email is already registered! Please log in.');
    }

    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    setStored(USERS_KEY, users);

    const token = `jwt_token_${newUser.id}_${Date.now()}`;
    const safeUser = { ...newUser };
    delete safeUser.password;
    authService.setCurrentUser(safeUser, token);
    return { user: safeUser, token };
  },

  logout() {
    authService.setCurrentUser(null);
  },

  quickSwitchRole(role: 'USER' | 'ADMIN') {
    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);
    const target = users.find(u => u.role === role) || users[0];
    const safeUser = { ...target };
    delete safeUser.password;
    authService.setCurrentUser(safeUser, `mock_jwt_${target.id}_${role}`);
    return safeUser;
  }
};

// ---------------- VEHICLE SERVICES ----------------
export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.get('/vehicles');
        return res.data;
      } catch (err) {
        console.warn('Spring Boot unavailable, falling back to local database:', err);
      }
    }
    return getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
  },

  async getById(id: number): Promise<Vehicle> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.get(`/vehicles/${id}`);
        return res.data;
      } catch (err) {
        console.warn('Spring Boot error:', err);
      }
    }
    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) throw new Error('Vehicle not found with ID: ' + id);
    return vehicle;
  },

  async create(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    if (getApiMode() === 'springboot') {
      const res = await axiosClient.post('/vehicles', vehicle);
      return res.data;
    }
    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now()
    };
    vehicles.unshift(newVehicle);
    setStored(VEHICLES_KEY, vehicles);
    return newVehicle;
  },

  async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    if (getApiMode() === 'springboot') {
      const res = await axiosClient.put(`/vehicles/${id}`, vehicle);
      return res.data;
    }
    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    vehicles[index] = { ...vehicles[index], ...vehicle };
    setStored(VEHICLES_KEY, vehicles);
    return vehicles[index];
  },

  async delete(id: number): Promise<void> {
    if (getApiMode() === 'springboot') {
      await axiosClient.delete(`/vehicles/${id}`);
      return;
    }
    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const filtered = vehicles.filter(v => v.id !== id);
    setStored(VEHICLES_KEY, filtered);
  },

  async toggleAvailability(id: number): Promise<Vehicle> {
    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const v = vehicles.find(item => item.id === id);
    if (!v) throw new Error('Vehicle not found');
    return this.update(id, { availability: !v.availability });
  }
};

// ---------------- BOOKING SERVICES ----------------
export const bookingService = {
  async create(bookingData: { vehicleId: number; startDate: string; endDate: string }): Promise<Booking> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error('You must be logged in to make a booking.');

    // Validate dates
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Please select valid start and end dates.');
    }
    if (start < today) {
      throw new Error('Rental start date cannot be in the past.');
    }
    if (end <= start) {
      throw new Error('Rental end date must be strictly after start date.');
    }

    // Difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (getApiMode() === 'springboot') {
      const res = await axiosClient.post('/bookings', {
        userId: currentUser.id,
        vehicleId: bookingData.vehicleId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalDays,
      });
      return res.data;
    }

    const vehicle = await vehicleService.getById(bookingData.vehicleId);
    if (!vehicle.availability) {
      throw new Error('This vehicle is currently unavailable or under maintenance.');
    }

    // Check collision with existing active bookings
    const bookings = getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const hasConflict = bookings.some(b => 
      b.vehicleId === vehicle.id &&
      (b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING') &&
      !(new Date(bookingData.endDate) <= new Date(b.startDate) || new Date(bookingData.startDate) >= new Date(b.endDate))
    );

    if (hasConflict) {
      throw new Error('Vehicle is already booked for the selected dates. Please choose another date range.');
    }

    const totalAmount = totalDays * vehicle.pricePerDay;

    const newBooking: Booking = {
      id: Date.now(),
      userId: currentUser.id,
      vehicleId: vehicle.id,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalDays,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString().split('T')[0],
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      vehicleName: vehicle.vehicleName,
      vehicleBrand: vehicle.brand,
      vehicleType: vehicle.type,
      vehicleImage: vehicle.imageUrl,
    };

    bookings.unshift(newBooking);
    setStored(BOOKINGS_KEY, bookings);
    return newBooking;
  },

  async getMyBookings(): Promise<Booking[]> {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];

    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.get('/bookings/my');
        return res.data;
      } catch (err) {
        console.warn('Falling back to local data');
      }
    }

    const bookings = getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    return bookings.filter(b => b.userId === currentUser.id);
  },

  async cancelBooking(bookingId: number): Promise<Booking> {
    if (getApiMode() === 'springboot') {
      const res = await axiosClient.put(`/bookings/${bookingId}/cancel`);
      return res.data;
    }

    const bookings = getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    if (bookings[index].bookingStatus === 'COMPLETED') {
      throw new Error('Completed bookings cannot be cancelled.');
    }

    bookings[index].bookingStatus = 'CANCELLED';
    setStored(BOOKINGS_KEY, bookings);
    return bookings[index];
  }
};

// ---------------- ADMIN SERVICES ----------------
export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.get('/admin/dashboard');
        return res.data;
      } catch (err) {
        console.warn('Falling back to local stats');
      }
    }

    const vehicles = getStored<Vehicle[]>(VEHICLES_KEY, INITIAL_VEHICLES);
    const bookings = getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);

    const availableVehicles = vehicles.filter(v => v.availability).length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING').length;
    const totalRevenue = bookings
      .filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      totalVehicles: vehicles.length,
      availableVehicles,
      totalBookings: bookings.length,
      pendingBookings,
      registeredUsers: users.length,
      totalRevenue
    };
  },

  async getAllBookings(): Promise<Booking[]> {
    if (getApiMode() === 'springboot') {
      try {
        const res = await axiosClient.get('/admin/bookings');
        return res.data;
      } catch (err) {
        console.warn('Falling back to local bookings');
      }
    }
    return getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
  },

  async updateBookingStatus(bookingId: number, status: Booking['bookingStatus']): Promise<Booking> {
    if (getApiMode() === 'springboot') {
      const res = await axiosClient.put(`/admin/bookings/${bookingId}/status`, { status });
      return res.data;
    }

    const bookings = getStored<Booking[]>(BOOKINGS_KEY, INITIAL_BOOKINGS);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    bookings[index].bookingStatus = status;
    setStored(BOOKINGS_KEY, bookings);
    return bookings[index];
  },

  async getAllUsers(): Promise<User[]> {
    const users = getStored<User[]>(USERS_KEY, INITIAL_USERS);
    return users.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
  }
};
