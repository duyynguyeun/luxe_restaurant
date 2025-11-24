package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService; // Dùng interface, không phải implementation

    /**
     * Tạo đơn hàng mới
     * POST /api/orders/create
     */
    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    /**
     * Lấy tất cả đơn hàng (Admin)
     * GET /api/orders/getall
     */
    @GetMapping("/getall")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    /**
     * Cập nhật trạng thái đơn hàng (có validation tự động)
     * PUT /api/orders/update-status/1?status=PAID
     */
    @PutMapping("/update-status/{id}")
    public void updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        orderService.updateStatus(id, status);
    }

    /**
     * Lấy đơn hàng của user
     * GET /api/orders/my-orders/5
     */
    @GetMapping("/findOrder/{id}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }
}