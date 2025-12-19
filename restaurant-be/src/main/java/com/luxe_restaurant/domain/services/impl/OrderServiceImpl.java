package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.order.OrderItemRequest;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.entities.OrderDetail;
import com.luxe_restaurant.domain.entities.User;
import com.luxe_restaurant.domain.enums.OrderStatus;
import com.luxe_restaurant.domain.repositories.OrderRepository;
import com.luxe_restaurant.domain.repositories.UserRepository;
import com.luxe_restaurant.domain.services.mail.EmailService;
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final BigDecimal BASE_POINTS = new BigDecimal("100"); 
    private static final BigDecimal MONEY_RATIO = new BigDecimal("1000"); 

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
        // 1. Khởi tạo đối tượng Order từ Request
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerAddress(request.getCustomerAddress());
        order.setTotalPrice(request.getTotalPrice());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNote(request.getNote());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        // 2. Gán User (nếu có)
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        }

        // 3. Xử lý Chi tiết món ăn (OrderDetail)
        List<OrderDetail> details = new ArrayList<>();
        if (request.getItems() != null) {
            for (OrderItemRequest item : request.getItems()) {
                OrderDetail detail = OrderDetail.builder()
                        .dishName(item.getDishName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .order(order)
                        .build();
                details.add(detail);
            }
        }
        order.setOrderDetails(details);

        // 4. Lưu đơn hàng - CHỈ KHAI BÁO BIẾN savedOrder 1 LẦN DUY NHẤT
        Order savedOrder = orderRepository.save(order);

        // 5. Gửi thông báo REAL-TIME (Dùng tên biến notificationMsg để tránh trùng)
        try {
            String notificationMsg = "Đơn hàng mới: #" + savedOrder.getId() + " từ " + savedOrder.getCustomerName();
            messagingTemplate.convertAndSend("/topic/admin/orders", notificationMsg);
            log.info("Real-time: Đã gửi thông báo cho đơn hàng mới #{}", savedOrder.getId());
        } catch (Exception e) {
            log.error("WebSocket Error: {}", e.getMessage());
        }

        return savedOrder;
    }

    @Override
    @Transactional
    public void updateStatus(Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase());

        if (currentStatus == newStatus) return;

        List<OrderStatus> validNext = VALID_TRANSITIONS.get(currentStatus);
        if (validNext == null || !validNext.contains(newStatus)) {
            throw new IllegalStateException(String.format("Không thể chuyển từ %s sang %s", currentStatus, newStatus));
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
        sendStatusEmail(order, newStatus);

        if (newStatus == OrderStatus.COMPLETED && order.getUser() != null) {
            addPointsToUser(order);
        }
    }

    private void sendStatusEmail(Order order, OrderStatus status) {
        if (order.getUser() == null || order.getUser().getEmail() == null) return;
        String email = order.getUser().getEmail();
        String subject = "Luxe Restaurant - Cập nhật trạng thái đơn hàng";
        String content = switch (status) {
            case PAID -> "Đơn hàng #" + order.getId() + " đã thanh toán.";
            case PREPARING -> "Nhà bếp đang thực hiện món ăn cho bạn.";
            case COMPLETED -> "Đơn hàng hoàn tất. Chúc bạn ngon miệng!";
            case CANCELLED -> "Đơn hàng của bạn đã bị hủy.";
            default -> "Đơn hàng được cập nhật trạng thái mới: " + status;
        };
        emailService.send(email, subject, content);
    }

    private void addPointsToUser(Order order) {
        User user = order.getUser();
        BigDecimal moneyPoints = order.getTotalPrice().divide(MONEY_RATIO, 0, RoundingMode.DOWN);
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