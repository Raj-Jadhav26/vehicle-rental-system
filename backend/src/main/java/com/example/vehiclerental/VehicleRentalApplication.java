package com.example.vehiclerental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for Cloud-Based Vehicle Rental Management System.
 * Developed for 3rd-Year Computer Engineering College Mini-Project.
 * Architecture: Spring Boot 3.3.0 + Spring Data JPA + MySQL 8.0 + AWS
 */
@SpringBootApplication
public class VehicleRentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehicleRentalApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Vehicle Rental Backend Started Successfully!");
        System.out.println(" API Base URL: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
