package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.domain.entities.Reservation;
import com.luxe_restaurant.domain.entities.RestaurantTable;
import com.luxe_restaurant.domain.enums.TableStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationService {

    List<RestaurantTable> getAvailableTables(LocalDateTime start, LocalDateTime end);

    Reservation createReservation(
            String customerName,
            String customerPhone,
            Long tableId,
            LocalDateTime start,
            LocalDateTime end
    );

    void cancelReservation(Long reservationId);

    void updateTableStatus(Long tableId, TableStatus status);
}
