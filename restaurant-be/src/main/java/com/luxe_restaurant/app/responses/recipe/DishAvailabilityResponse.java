package com.luxe_restaurant.app.responses.recipe;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishAvailabilityResponse {

    private Long dishId;
    private String dishName;
    private long availableServings;
    private String status; // AVAILABLE, OUT_OF_STOCK, RECIPE_NOT_CONFIGURED
    private List<MissingIngredientDetail> missingIngredients;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissingIngredientDetail {
        private Long ingredientId;
        private String ingredientCode;
        private String ingredientName;
        private BigDecimal requiredQuantity;
        private BigDecimal availableQuantity;
        private IngredientUnit baseUnit;
    }
}
