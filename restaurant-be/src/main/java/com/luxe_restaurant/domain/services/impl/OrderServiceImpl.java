package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.order.OrderItemRequest;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.entities.OrderDetail;
import com.luxe_restaurant.domain.entities.User; // <--- DÒNG BẠN ĐANG THIẾU
import com.luxe_restaurant.domain.enums.OrderStatus;
import com.luxe_restaurant.domain.repositories.OrderRepository;
import com.luxe_restaurant.domain.repositories.UserRepository; // <--- CÓ THỂ THIẾU DÒNG NÀY NỮA
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository; // (Khai báo thêm cái này và thêm vào constructor/RequiredArgsConstructor)

    @Override
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerAddress(request.getCustomerAddress());
        order.setTotalPrice(request.getTotalPrice());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        List<OrderDetail> details = new ArrayList<>();
        for (OrderItemRequest item : request.getItems()) {
            OrderDetail detail = OrderDetail.builder()
                    .dishName(item.getDishName())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .order(order)
                    .build();
            details.add(detail);
        }
        order.setOrderDetails(details);
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            order.setUser(user);
        }
        // --------------------------------------------
        return orderRepository.save(order);
    }
    // Thêm hàm này (nhớ khai báo trong Interface OrderService trước nhé)
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(OrderStatus.valueOf(status));
        orderRepository.save(order);
    }
}