package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.domain.entities.Reservation;
import com.luxe_restaurant.domain.entities.RestaurantTable;
import com.luxe_restaurant.domain.enums.ReservationStatus;
import com.luxe_restaurant.domain.enums.TableStatus;
import com.luxe_restaurant.domain.repositories.ReservationRepository;
import com.luxe_restaurant.domain.repositories.RestaurantTableRepository;
import com.luxe_restaurant.domain.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final RestaurantTableRepository tableRepo;
    private final ReservationRepository reservationRepo;

    @Override
    public List<RestaurantTable> getAvailableTables(LocalDateTime start, LocalDateTime end) {
        List<Reservation> reservations = reservationRepo.findAllOverlapping(start, end);
        List<Long> busyTableIds = reservations.stream().map(r -> r.getTable().getId()).toList();

        return tableRepo.findAll()
                .stream()
                .filter(t -> !busyTableIds.contains(t.getId()))
                .toList();
    }

    @Override
    public Reservation createReservation(String name, String phone, Long tableId, LocalDateTime start, LocalDateTime end) {

        RestaurantTable table = tableRepo.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        if (!reservationRepo.findOverlapping(table, start, end).isEmpty()) {
            throw new IllegalStateException("Table already booked in this time period");
        }

        Reservation r = new Reservation();
        r.setCustomerName(name);
        r.setCustomerPhone(phone);
        r.setTable(table);
        r.setStartTime(start);
        r.setEndTime(end);

        table.setStatus(TableStatus.RESERVED);
        tableRepo.save(table);

        return reservationRepo.save(r);
    }

    @Override
    public void cancelReservation(Long id) {
        Reservation r = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        r.setStatus(ReservationStatus.CANCELLED);
        reservationRepo.save(r);

        RestaurantTable table = r.getTable();
        table.setStatus(TableStatus.AVAILABLE);
        tableRepo.save(table);
    }

    @Override
    public void updateTableStatus(Long tableId, TableStatus status) {
        RestaurantTable table = tableRepo.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));
        table.setStatus(status);
        tableRepo.save(table);
    }
}
