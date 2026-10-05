package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.BookingRequest;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {

        Booking created = bookingService.createBooking(request, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "2") Long userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
}
