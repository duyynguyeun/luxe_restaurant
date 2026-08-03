package com.luxe_restaurant.app.requests.inventory;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionItemRequest {

    @NotNull(message = "ID nguyên liệu không được để trống")
    private Long ingredientId;

    @NotNull(message = "Số lượng không được để trống")
    @DecimalMin(value = "0.0001", message = "Số lượng phải lớn hơn 0")
    private BigDecimal quantity;

    @NotNull(message = "Đơn vị tính không được để trống")
    private IngredientUnit unit;

    @DecimalMin(value = "0.0", message = "Đơn giá không được nhỏ hơn 0")
    private BigDecimal unitCost;

    private String batchCode;

    private LocalDate expiryDate;
}
