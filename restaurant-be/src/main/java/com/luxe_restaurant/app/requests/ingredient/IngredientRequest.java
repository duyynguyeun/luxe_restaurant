package com.luxe_restaurant.app.requests.ingredient;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IngredientRequest {

    @NotBlank(message = "Mã nguyên liệu không được để trống")
    private String code;

    @NotBlank(message = "Tên nguyên liệu không được để trống")
    private String name;

    @NotNull(message = "Đơn vị cơ sở không được để trống")
    private IngredientUnit baseUnit;

    private String description;

    @DecimalMin(value = "0.0", message = "Ngưỡng cảnh báo không được nhỏ hơn 0")
    private BigDecimal lowStockThreshold;

    private Boolean active;
}
