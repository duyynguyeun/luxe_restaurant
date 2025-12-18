package com.luxe_restaurant.app.responses.dish;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishSalesResponse {
    private String dishName;
    private String categoryName;
    private Long totalQuantity;
    private BigDecimal totalRevenue;

}
