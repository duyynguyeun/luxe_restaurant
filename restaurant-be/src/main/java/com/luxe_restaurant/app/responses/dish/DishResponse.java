package com.luxe_restaurant.app.responses.dish;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishResponse {
    private String id;
    private String nameDish;
    private String urlImage;
    private BigDecimal price;
    private CategoryResponse category;
}
