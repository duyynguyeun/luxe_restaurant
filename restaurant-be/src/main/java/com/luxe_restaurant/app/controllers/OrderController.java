package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.order.OrderRequest;
import com.luxe_restaurant.app.responses.dish.DishSalesResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.entities.Order;
import com.luxe_restaurant.domain.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    public PageResponse<Order> getAllOrders(@PageableDefault (size = 10, page = 0) Pageable pageable) {
        return new PageResponse<>(orderService.getAllOrders(pageable));
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

    @GetMapping("/top-dishes")
    public ResponseEntity<List<DishSalesResponse>> getTopSellingDishes(
            @RequestParam(value = "type", defaultValue = "day") String type,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<DishSalesResponse> reportData = orderService.getTopSellingDishes(type, date);
        return ResponseEntity.ok(reportData);
    }
}