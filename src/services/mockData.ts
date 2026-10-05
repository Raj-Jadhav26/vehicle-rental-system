import { Vehicle, User, Booking } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    email: 'admin@vehiclerental.com',
    password: 'password123',
    phone: '+91 9876543210',
    role: 'ADMIN',
    createdAt: '2026-09-01'
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    email: 'user@vehiclerental.com',
    password: 'password123',
    phone: '+91 9123456789',
    role: 'USER',
    createdAt: '2026-09-10'
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91 9898989898',
    role: 'USER',
    createdAt: '2026-09-15'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 1,
    vehicleName: 'Honda City',
    brand: 'Honda',
    type: 'CAR',
    model: '2023 ZX',
    registrationNumber: 'MH-12-AB-1234',
    pricePerDay: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Premium sedan with smooth CVT automatic, leather seats, sunroof, and 1.5L i-VTEC petrol engine. Ideal for highway cruising and business trips.',
    seatingCapacity: 5,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC'
  },
  {
    id: 2,
    vehicleName: 'Toyota Innova Crysta',
    brand: 'Toyota',
    type: 'CAR',
    model: '2022 2.4 VX',
    registrationNumber: 'MH-14-CD-5678',
    pricePerDay: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Spacious and comfortable 7-seater MPV with unmatched reliability, dual AC, large luggage space, and robust diesel performance for family vacations.',
    seatingCapacity: 7,
    fuelType: 'DIESEL',
    transmission: 'MANUAL'
  },
  {
    id: 3,
    vehicleName: 'Hyundai Creta',
    brand: 'Hyundai',
    type: 'CAR',
    model: '2023 SX(O)',
    registrationNumber: 'DL-01-EF-9012',
    pricePerDay: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Popular compact SUV featuring panoramic sunroof, ventilated front seats, high ground clearance, and modern connected tech.',
    seatingCapacity: 5,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC'
  },
  {
    id: 4,
    vehicleName: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    type: 'BIKE',
    model: '2023 Reborn',
    registrationNumber: 'KA-05-GH-3456',
    pricePerDay: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Iconic retro cruiser motorcycle with the classic thump, dual-channel ABS, relaxed riding posture, and commanding highway presence.',
    seatingCapacity: 2,
    fuelType: 'PETROL',
    transmission: 'MANUAL'
  },
  {
    id: 5,
    vehicleName: 'Honda Activa 6G',
    brand: 'Honda',
    type: 'SCOOTER',
    model: '2023 Deluxe',
    registrationNumber: 'MH-02-IJ-7890',
    pricePerDay: 500,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'India\'s most loved automatic scooter. Lightweight, super fuel-efficient, telescopic front suspension, and perfect for quick daily city commutes.',
    seatingCapacity: 2,
    fuelType: 'PETROL',
    transmission: 'AUTOMATIC'
  },
  {
    id: 6,
    vehicleName: 'Yamaha FZ-S FI',
    brand: 'Yamaha',
    type: 'BIKE',
    model: '2023 V4',
    registrationNumber: 'TN-09-KL-2345',
    pricePerDay: 800,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Muscular street naked motorcycle with traction control system, single-channel ABS, inverted LCD cluster, and great cornering dynamics.',
    seatingCapacity: 2,
    fuelType: 'PETROL',
    transmission: 'MANUAL'
  },
  {
    id: 7,
    vehicleName: 'Ather 450X',
    brand: 'Ather',
    type: 'SCOOTER',
    model: '2024 Gen 3',
    registrationNumber: 'KA-01-EV-1122',
    pricePerDay: 650,
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'High-speed smart electric scooter with 105km certified true range, touchscreen dashboard with Google Maps navigation, and Warp mode.',
    seatingCapacity: 2,
    fuelType: 'ELECTRIC',
    transmission: 'AUTOMATIC'
  },
  {
    id: 8,
    vehicleName: 'Maruti Suzuki Swift',
    brand: 'Maruti Suzuki',
    type: 'CAR',
    model: '2023 ZXi',
    registrationNumber: 'GJ-06-MN-4455',
    pricePerDay: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    availability: true,
    description: 'Peppy and fuel-efficient hatchback with sporty styling, keyless push-start, crisp steering, and great city parking convenience.',
    seatingCapacity: 5,
    fuelType: 'PETROL',
    transmission: 'MANUAL'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 101,
    userId: 2,
    vehicleId: 1,
    startDate: '2026-10-10',
    endDate: '2026-10-13',
    totalDays: 3,
    totalAmount: 6600,
    bookingStatus: 'CONFIRMED',
    createdAt: '2026-10-01',
    userName: 'Rahul Sharma',
    userEmail: 'user@vehiclerental.com',
    userPhone: '+91 9123456789',
    vehicleName: 'Honda City',
    vehicleBrand: 'Honda',
    vehicleType: 'CAR',
    vehicleImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 102,
    userId: 2,
    vehicleId: 4,
    startDate: '2026-10-18',
    endDate: '2026-10-20',
    totalDays: 2,
    totalAmount: 2400,
    bookingStatus: 'PENDING',
    createdAt: '2026-10-03',
    userName: 'Rahul Sharma',
    userEmail: 'user@vehiclerental.com',
    userPhone: '+91 9123456789',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleBrand: 'Royal Enfield',
    vehicleType: 'BIKE',
    vehicleImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80'
  }
];
