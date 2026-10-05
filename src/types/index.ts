export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
}

export type VehicleType = 'CAR' | 'BIKE' | 'SCOOTER';

export interface Vehicle {
  id: number;
  vehicleName: string;
  brand: string;
  type: VehicleType;
  model: string;
  registrationNumber: string;
  pricePerDay: number;
  imageUrl: string;
  availability: boolean;
  description: string;
  seatingCapacity?: number;
  fuelType?: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  transmission?: 'MANUAL' | 'AUTOMATIC';
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  totalDays: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  createdAt: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  vehicleName?: string;
  vehicleBrand?: string;
  vehicleType?: VehicleType;
  vehicleImage?: string;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  totalBookings: number;
  pendingBookings: number;
  registeredUsers: number;
  totalRevenue: number;
}
