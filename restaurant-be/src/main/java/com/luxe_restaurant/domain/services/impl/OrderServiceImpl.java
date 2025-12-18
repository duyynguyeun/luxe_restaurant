package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.order.OrderItemRequest;
import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.app.responses.dish.DishSalesResponse;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.entities.OrderDetail;
import com.luxe_restaurant.domain.entities.User;
import com.luxe_restaurant.domain.enums.OrderStatus;
import com.luxe_restaurant.domain.repositories.OrderRepository;
import com.luxe_restaurant.domain.repositories.UserRepository;
import com.luxe_restaurant.domain.services.mail.EmailService;
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // Cấu hình điểm
    private static final BigDecimal BASE_POINTS = new BigDecimal("100"); // 100 điểm cố định/đơn
    private static final BigDecimal MONEY_RATIO = new BigDecimal("1000"); // mỗi 1000đ được 1 điểm

    // Quy tắc chuyển trạng thái hợp lệ
    private static final Map<OrderStatus, List<OrderStatus>> VALID_TRANSITIONS = Map.of(
            OrderStatus.PENDING, List.of(OrderStatus.PAID, OrderStatus.CANCELLED),
            OrderStatus.PAID, List.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
            OrderStatus.PREPARING, List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED),
            OrderStatus.COMPLETED, List.of(),
            OrderStatus.CANCELLED, List.of()
    );

    // ------------------- Tạo đơn hàng -------------------
    @Override
    @Transactional
    public Order createOrder(OrderRequest request) {

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setCustomerAddress(request.getCustomerAddress());
        order.setTotalPrice(request.getTotalPrice());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNote(request.getNote()); // <--- CHỈ CẦN THÊM DÒNG NÀY LÀ XONG
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        // Chi tiết món
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

        // Có user → gán user
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        }

        return orderRepository.save(order);
    }

    // ------------------- Cập nhật trạng thái đơn -------------------
    @Override
    @Transactional
    public void updateStatus(Long orderId, String statusStr) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = OrderStatus.valueOf(statusStr.toUpperCase());

        // Nếu giống nhau thì bỏ qua
        if (currentStatus == newStatus) return;

        // Check xem có hợp lệ không
        List<OrderStatus> validNext = VALID_TRANSITIONS.get(currentStatus);
        if (validNext == null || !validNext.contains(newStatus)) {
            throw new IllegalStateException(
                    String.format("Không thể chuyển từ %s sang %s", currentStatus, newStatus)
            );
        }

        // Lưu trạng thái mới
        order.setStatus(newStatus);
        orderRepository.save(order);

        // Gửi email thông báo
        sendStatusEmail(order, newStatus);

        // Hoàn thành đơn → cộng điểm
        if (newStatus == OrderStatus.COMPLETED && order.getUser() != null) {
            addPointsToUser(order);
        }
    }

    // ------------------- Gửi email theo trạng thái -------------------
    private void sendStatusEmail(Order order, OrderStatus status) {

        if (order.getUser() == null) return;

        String email = order.getUser().getEmail();
        String subject = "Cập nhật trạng thái đơn hàng của bạn";
        String message;

        switch (status) {
            case PAID:
                message = "Đơn hàng của bạn đã được thanh toán thành công!";
                break;
            case PREPARING:
                message = "Đơn hàng của bạn đang được nhà bếp chuẩn bị.";
                break;
            case COMPLETED:
                message = "Đơn hàng của bạn đã hoàn thành. Cảm ơn bạn đã tin tưởng Luxe Restaurant!";
                break;
            case CANCELLED:
                message = "Đơn hàng của bạn đã bị hủy.";
                break;
            default:
                message = "Đơn hàng của bạn được cập nhật trạng thái: " + status;
        }

        emailService.send(email, subject, message);
    }

    // ------------------- Cộng điểm -------------------
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
    public List<DishSalesResponse> getTopSellingDishes(String type, LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }

        LocalDateTime startDate;
        LocalDateTime endDate;

        switch (type.toLowerCase()) {
            case "week":
                startDate = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay();
                endDate   = date.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY)).atTime(LocalTime.MAX);
                break;
            case "month":
                startDate = date.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                endDate   = date.with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
                break;
            default:  // day
                startDate = date.atStartOfDay();
                endDate   = date.atTime(LocalTime.MAX);
                break;
        }

        return orderRepository.findTopSellingDishes(startDate, endDate);
    }



    // ------------------- Lấy đơn theo user -------------------
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // ------------------- Lấy tất cả -------------------
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
