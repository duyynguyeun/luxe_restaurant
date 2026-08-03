package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.recipe.RecipeUpdateRequest;
import com.luxe_restaurant.app.responses.recipe.DishAvailabilityResponse;
import com.luxe_restaurant.app.responses.recipe.RecipeItemResponse;
import com.luxe_restaurant.domain.services.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/api/admin/menu-items/{menuItemId}/ingredients")
    public List<RecipeItemResponse> getRecipeByDishId(@PathVariable("menuItemId") Long dishId) {
        return recipeService.getRecipeByDishId(dishId);
    }

    @PutMapping("/api/admin/menu-items/{menuItemId}/ingredients")
    public List<RecipeItemResponse> updateRecipe(@PathVariable("menuItemId") Long dishId,
                                                @Valid @RequestBody RecipeUpdateRequest request) {
        return recipeService.updateRecipe(dishId, request);
    }

    @GetMapping("/api/menu-items/{menuItemId}/availability")
    public DishAvailabilityResponse getDishAvailability(@PathVariable("menuItemId") Long dishId) {
        return recipeService.getDishAvailability(dishId);
    }
}
