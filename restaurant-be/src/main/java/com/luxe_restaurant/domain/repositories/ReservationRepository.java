package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.Reservation;
import com.luxe_restaurant.domain.entities.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.table = :table
        AND r.status = 'RESERVED'
        AND (:start < r.endTime AND :end > r.startTime)
    """)
    List<Reservation> findOverlapping(RestaurantTable table, LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.status = 'RESERVED'
        AND (:start < r.endTime AND :end > r.startTime)
    """)
    List<Reservation> findAllOverlapping(LocalDateTime start, LocalDateTime end);
}
