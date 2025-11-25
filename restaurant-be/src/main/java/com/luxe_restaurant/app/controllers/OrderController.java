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
    private final OrderService orderService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/getall")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/update-status/{id}")
    public void updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        orderService.updateStatus(id, status);
    }

    @GetMapping("/findOrder/{id}")
    public List<Order> getOrdersByUser(@PathVariable Long id) {
        return orderService.getOrdersByUserId(id);
    }
}