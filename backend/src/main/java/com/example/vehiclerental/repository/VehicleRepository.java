package com.example.vehiclerental.repository;

import com.example.vehiclerental.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByType(Vehicle.VehicleType type);
    List<Vehicle> findByAvailability(Boolean availability);
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    Boolean existsByRegistrationNumber(String registrationNumber);
}
