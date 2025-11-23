package com.luxe_restaurant.domain.services;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.domain.entities.Order;
import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getAllOrders();
    void updateStatus(Long id, String status);
    List<Order> getOrdersByUserId(Long userId);
}