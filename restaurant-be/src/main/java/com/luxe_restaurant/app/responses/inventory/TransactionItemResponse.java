package com.luxe_restaurant.app.responses.inventory;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionItemResponse {

    private Long id;
    private Long ingredientId;
    private String ingredientCode;
    private String ingredientName;
    private BigDecimal inputQuantity;
    private IngredientUnit inputUnit;
    private BigDecimal baseQuantity;
    private IngredientUnit baseUnit;
    private BigDecimal unitCost;
    private BigDecimal totalCost;
    private String batchCode;
    private LocalDate expiryDate;
    private BigDecimal stockBefore;
    private BigDecimal stockAfter;
}
