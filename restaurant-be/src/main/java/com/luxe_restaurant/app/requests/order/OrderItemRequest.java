package com.luxe_restaurant.app.requests.order;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemRequest {
    private String dishName;
    private int quantity;
    private BigDecimal price;
}