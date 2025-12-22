package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.domain.entities.Reservation;
import com.luxe_restaurant.domain.entities.RestaurantTable;
import com.luxe_restaurant.domain.enums.TableStatus;
import com.luxe_restaurant.domain.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReservationController {

    private final ReservationService service;

    @GetMapping("/available")
    public List<RestaurantTable> getAvailableTables(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return service.getAvailableTables(start, end);
    }

    @PostMapping("/book")
    public Reservation book(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam Long tableId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        return service.createReservation(name, phone, tableId, start, end);
    }

    @PutMapping("/cancel/{id}")
    public void cancel(@PathVariable Long id) {
        service.cancelReservation(id);
    }

    @PutMapping("/table-status/{tableId}")
    public void updateTableStatus(
            @PathVariable Long tableId,
            @RequestParam TableStatus status
    ) {
        service.updateTableStatus(tableId, status);
    }
    @GetMapping("/getall")
    public List<Reservation> getAllReservations() {
        return service.getAllReservations();
    }
}
