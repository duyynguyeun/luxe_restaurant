package com.luxe_restaurant.app.responses.ingredient;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientResponse {

    private Long id;
    private String code;
    private String name;
    private IngredientUnit baseUnit;
    private String description;
    private BigDecimal lowStockThreshold;
    private boolean active;
    private BigDecimal quantityOnHand;
    private BigDecimal averageCost;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
