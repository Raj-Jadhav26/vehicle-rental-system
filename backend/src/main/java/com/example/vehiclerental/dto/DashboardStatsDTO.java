package com.example.vehiclerental.dto;

public class DashboardStatsDTO {

    private long totalVehicles;
    private long availableVehicles;
    private long totalBookings;
    private long pendingBookings;
    private long registeredUsers;
    private double totalRevenue;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long totalVehicles, long availableVehicles, long totalBookings,
                             long pendingBookings, long registeredUsers, double totalRevenue) {
        this.totalVehicles = totalVehicles;
        this.availableVehicles = availableVehicles;
        this.totalBookings = totalBookings;
        this.pendingBookings = pendingBookings;
        this.registeredUsers = registeredUsers;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getAvailableVehicles() { return availableVehicles; }
    public void setAvailableVehicles(long availableVehicles) { this.availableVehicles = availableVehicles; }

    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

    public long getRegisteredUsers() { return registeredUsers; }
    public void setRegisteredUsers(long registeredUsers) { this.registeredUsers = registeredUsers; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
}
