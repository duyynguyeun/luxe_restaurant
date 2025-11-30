package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.order.OrderItemRequest;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.domain.entities.*;
import com.luxe_restaurant.domain.enums.OrderStatus;
import com.luxe_restaurant.domain.repositories.*;
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    private static final BigDecimal BASE_POINTS = new BigDecimal("100"); // 500 điểm cố định/đơn
    private static final BigDecimal MONEY_RATIO = new BigDecimal("1000"); // 1000đ = 1 điểm

    private static final Map<OrderStatus, List<OrderStatus>> VALID_TRANSITIONS = Map.of(
            OrderStatus.PENDING, List.of(OrderStatus.PAID, OrderStatus.CANCELLED),
            OrderStatus.PAID, List.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
            OrderStatus.PREPARING, List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED),
            OrderStatus.COMPLETED, List.of(),
            OrderStatus.CANCELLED, List.of()
    );

    @Override
    @Transactional
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

        // Gắn User nếu có
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        }

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void updateStatus(Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase());

        if (currentStatus == newStatus) {
            return;
        }

        List<OrderStatus> validNext = VALID_TRANSITIONS.get(currentStatus);
        if (validNext == null || !validNext.contains(newStatus)) {
            throw new IllegalStateException(
                    String.format("Không thể chuyển từ %s sang %s", currentStatus, newStatus)
            );
        }

        // Cập nhật trạng thái
        order.setStatus(newStatus);
        orderRepository.save(order);

        // ========== TÍCH ĐIỂM KHI HOÀN THÀNH ==========
        if (newStatus == OrderStatus.COMPLETED && order.getUser() != null) {
            addPointsToUser(order);
        }
    }

    private void addPointsToUser(Order order) {
        User user = order.getUser();

        BigDecimal moneyPoints = order.getTotalPrice()
                .divide(MONEY_RATIO, 0, BigDecimal.ROUND_DOWN);
        BigDecimal totalPoints = BASE_POINTS.add(moneyPoints);

        BigDecimal currentPoints = user.getPoint() != null ? user.getPoint() : BigDecimal.ZERO;
        user.setPoint(currentPoints.add(totalPoints));
        userRepository.save(user);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}