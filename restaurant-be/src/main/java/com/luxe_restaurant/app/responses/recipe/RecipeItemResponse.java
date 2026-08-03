package com.luxe_restaurant.app.responses.recipe;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeItemResponse {

    private Long id;
    private Long ingredientId;
    private String ingredientCode;
    private String ingredientName;
    private IngredientUnit baseUnit;
    private BigDecimal quantity;
    private String note;
    private BigDecimal averageCost;
    private BigDecimal estimatedCost; // quantity * averageCost
}
