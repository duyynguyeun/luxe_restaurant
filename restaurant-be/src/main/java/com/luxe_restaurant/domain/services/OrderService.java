package com.luxe_restaurant.domain.services;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.app.responses.dish.DishSalesResponse;
import com.luxe_restaurant.domain.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request);
    Page<Order> getAllOrders(Pageable pageable);
    void updateStatus(Long orderId, String statusStr);
    List<Order> getOrdersByUserId(Long userId);
    List<DishSalesResponse> getTopSellingDishes(String type, LocalDate date);
}