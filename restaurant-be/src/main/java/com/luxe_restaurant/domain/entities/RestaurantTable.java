package com.luxe_restaurant.domain.entities;

import com.luxe_restaurant.domain.enums.TableStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "restaurant_tables")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int tableNumber; // Bàn số 1 - 12

    private int seats = 6;   // Mặc định 6 ghế

    @Enumerated(EnumType.STRING)
    private TableStatus status = TableStatus.AVAILABLE;
}
