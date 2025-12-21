package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.app.responses.dish.DishSalesResponse;
import com.luxe_restaurant.domain.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

        @Query("""
        SELECT new com.luxe_restaurant.app.responses.dish.DishSalesResponse(
                COALESCE(d.nameDish, od.dishName), COALESCE(c.name, 'Không rõ'), SUM(od.quantity), SUM(od.price * od.quantity)
        )
        FROM Order o
        JOIN o.orderDetails od
        LEFT JOIN od.dish d
        LEFT JOIN d.category c
        WHERE o.status = 'COMPLETED'
            AND o.orderDate >= :startDate
            AND o.orderDate <= :endDate
        GROUP BY COALESCE(d.nameDish, od.dishName), COALESCE(c.name, 'Không rõ')
        ORDER BY SUM(od.quantity) DESC
""")
    List<DishSalesResponse> findTopSellingDishes(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate")   LocalDateTime endDate
    );



}