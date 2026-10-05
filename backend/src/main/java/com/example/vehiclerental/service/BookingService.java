package com.example.vehiclerental.service;

import com.example.vehiclerental.dto.BookingRequest;
import com.example.vehiclerental.dto.DashboardStatsDTO;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.exception.BadRequestException;
import com.example.vehiclerental.exception.ResourceNotFoundException;
import com.example.vehiclerental.repository.BookingRepository;
import com.example.vehiclerental.repository.UserRepository;
import com.example.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request, Long authenticatedUserId) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();

        // 1. Validation: Dates must not be in past
        if (startDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Rental start date cannot be in the past.");
        }
        if (endDate.isBefore(startDate) || endDate.isEqual(startDate)) {
            throw new BadRequestException("Rental end date must be strictly after the start date.");
        }

        // 2. Fetch Vehicle & Check Status
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        if (!vehicle.getAvailability()) {
            throw new BadRequestException("Vehicle is currently unavailable for rental.");
        }

        // 3. Collision Detection: Prevent overlapping bookings
        boolean hasConflict = bookingRepository.existsConflictingBooking(
                vehicle.getId(), startDate, endDate
        );
        if (hasConflict) {
            throw new BadRequestException("Vehicle is already booked for the selected dates. Please choose different dates.");
        }

        // 4. Fetch User
        Long targetUserId = request.getUserId() != null ? request.getUserId() : authenticatedUserId;
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + targetUserId));

        // 5. Automatic Calculations
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        double totalAmount = days * vehicle.getPricePerDay();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setTotalDays((int) days);
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    @Transactional
    public Booking cancelBooking(Long id, Long userId) {
        Booking booking = getBookingById(id);

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings.");
        }

        if (booking.getBookingStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = getBookingById(id);
        booking.setBookingStatus(status);
        return bookingRepository.save(booking);
    }

    public DashboardStatsDTO getDashboardStats() {
        long totalVehicles = vehicleRepository.count();
        long availableVehicles = vehicleRepository.findByAvailability(true).size();
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByBookingStatus(Booking.BookingStatus.PENDING);
        long registeredUsers = userRepository.count();

        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingStatus() == Booking.BookingStatus.CONFIRMED ||
                             b.getBookingStatus() == Booking.BookingStatus.COMPLETED)
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        return new DashboardStatsDTO(
                totalVehicles,
                availableVehicles,
                totalBookings,
                pendingBookings,
                registeredUsers,
                totalRevenue
        );
    }
}
