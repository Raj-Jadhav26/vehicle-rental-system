-- ==========================================================
-- Sample Data Seed Script for College Viva & Demonstration
-- ==========================================================

USE vehiclerental_db;

-- 1. Initial Users (Passwords hashed using BCrypt for 'password123')
INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'System Administrator', 'admin@vehiclerental.com', '$2a$10$w0u3hE8t7qZkWzM7vQ7Nye0l5M3zC9bYjK1pQ5h9c3L1jK9pQ5h9c', '9876543210', 'ADMIN'),
(2, 'Rahul Sharma', 'user@vehiclerental.com', '$2a$10$w0u3hE8t7qZkWzM7vQ7Nye0l5M3zC9bYjK1pQ5h9c3L1jK9pQ5h9c', '9123456789', 'USER'),
(3, 'Priya Patel', 'priya@example.com', '$2a$10$w0u3hE8t7qZkWzM7vQ7Nye0l5M3zC9bYjK1pQ5h9c3L1jK9pQ5h9c', '9898989898', 'USER')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Initial Vehicles Catalog
INSERT INTO vehicles (id, vehicle_name, brand, type, model, registration_number, price_per_day, image_url, availability, description, seating_capacity, fuel_type, transmission) VALUES
(1, 'Honda City', 'Honda', 'CAR', '2023 ZX', 'MH-12-AB-1234', 2200.00, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80', TRUE, 'Premium sedan with smooth CVT automatic, leather seats, sunroof, and 1.5L i-VTEC petrol engine.', 5, 'PETROL', 'AUTOMATIC'),
(2, 'Toyota Innova Crysta', 'Toyota', 'CAR', '2022 2.4 VX', 'MH-14-CD-5678', 3500.00, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80', TRUE, 'Spacious 7-seater MPV with unmatched reliability and dual AC for family trips.', 7, 'DIESEL', 'MANUAL'),
(3, 'Hyundai Creta', 'Hyundai', 'CAR', '2023 SX(O)', 'DL-01-EF-9012', 2800.00, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80', TRUE, 'Compact SUV featuring panoramic sunroof, ventilated front seats, and high ground clearance.', 5, 'PETROL', 'AUTOMATIC'),
(4, 'Royal Enfield Classic 350', 'Royal Enfield', 'BIKE', '2023 Reborn', 'KA-05-GH-3456', 1200.00, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80', TRUE, 'Retro cruiser motorcycle with classic thump, dual-channel ABS, and commanding posture.', 2, 'PETROL', 'MANUAL'),
(5, 'Honda Activa 6G', 'Honda', 'SCOOTER', '2023 Deluxe', 'MH-02-IJ-7890', 500.00, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80', TRUE, 'Lightweight and fuel-efficient automatic scooter, ideal for city traffic.', 2, 'PETROL', 'AUTOMATIC'),
(6, 'Yamaha FZ-S FI', 'Yamaha', 'BIKE', '2023 V4', 'TN-09-KL-2345', 800.00, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80', TRUE, 'Muscular street naked motorcycle with traction control and single-channel ABS.', 2, 'PETROL', 'MANUAL')
ON DUPLICATE KEY UPDATE id=id;
