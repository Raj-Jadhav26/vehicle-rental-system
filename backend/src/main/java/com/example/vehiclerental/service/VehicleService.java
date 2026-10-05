package com.example.vehiclerental.service;

import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.exception.BadRequestException;
import com.example.vehiclerental.exception.ResourceNotFoundException;
import com.example.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByAvailability(true);
    }

    public List<Vehicle> getVehiclesByType(Vehicle.VehicleType type) {
        return vehicleRepository.findByType(type);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new BadRequestException("Vehicle with this registration number already exists.");
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedData) {
        Vehicle existing = getVehicleById(id);

        existing.setVehicleName(updatedData.getVehicleName());
        existing.setBrand(updatedData.getBrand());
        existing.setType(updatedData.getType());
        existing.setModel(updatedData.getModel());
        existing.setPricePerDay(updatedData.getPricePerDay());
        existing.setImageUrl(updatedData.getImageUrl());
        existing.setAvailability(updatedData.getAvailability());
        existing.setDescription(updatedData.getDescription());
        if (updatedData.getSeatingCapacity() != null) {
            existing.setSeatingCapacity(updatedData.getSeatingCapacity());
        }
        if (updatedData.getFuelType() != null) {
            existing.setFuelType(updatedData.getFuelType());
        }
        if (updatedData.getTransmission() != null) {
            existing.setTransmission(updatedData.getTransmission());
        }

        return vehicleRepository.save(existing);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public Vehicle toggleAvailability(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setAvailability(!vehicle.getAvailability());
        return vehicleRepository.save(vehicle);
    }
}
