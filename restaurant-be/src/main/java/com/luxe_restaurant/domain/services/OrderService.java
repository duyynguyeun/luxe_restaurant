package com.luxe_restaurant.domain.services;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.app.responses.dish.DishSalesResponse;
import com.luxe_restaurant.domain.entities.Order;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getAllOrders();
    void updateStatus(Long orderId, String statusStr);
    List<Order> getOrdersByUserId(Long userId);
    List<DishSalesResponse> getTopSellingDishes(String type, LocalDate date);
}