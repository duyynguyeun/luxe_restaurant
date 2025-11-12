package com.luxe_restaurant.app.requests.dish;

import com.luxe_restaurant.domain.entities.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishRequest {
    private String dishName;
    private String urlImage;
    private BigDecimal price;
    private Long categoryId;
}
