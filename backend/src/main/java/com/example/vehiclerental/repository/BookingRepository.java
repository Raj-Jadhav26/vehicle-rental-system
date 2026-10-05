package com.example.vehiclerental.repository;

import com.example.vehiclerental.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    long countByBookingStatus(Booking.BookingStatus status);

    /**
     * Prevents double-booking: returns true if there exists any CONFIRMED or PENDING booking
     * for the same vehicle where date intervals overlap.
     * (requestedStart < existingEnd AND requestedEnd > existingStart)
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.vehicle.id = :vehicleId " +
           "AND b.bookingStatus IN ('CONFIRMED', 'PENDING') " +
           "AND (:startDate < b.endDate AND :endDate > b.startDate)")
    boolean existsConflictingBooking(
        @Param("vehicleId") Long vehicleId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
