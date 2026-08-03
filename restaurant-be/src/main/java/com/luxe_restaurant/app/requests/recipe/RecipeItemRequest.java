package com.luxe_restaurant.app.requests.recipe;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecipeItemRequest {

    @NotNull(message = "ID nguyên liệu không được để trống")
    private Long ingredientId;

    @NotNull(message = "Số lượng không được để trống")
    @DecimalMin(value = "0.0001", message = "Số lượng nguyên liệu phải lớn hơn 0")
    private BigDecimal quantity;

    private String note;
}
