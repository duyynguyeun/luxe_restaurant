package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.recipe.RecipeUpdateRequest;
import com.luxe_restaurant.app.responses.recipe.DishAvailabilityResponse;
import com.luxe_restaurant.app.responses.recipe.RecipeItemResponse;

import java.util.List;

public interface RecipeService {

    List<RecipeItemResponse> getRecipeByDishId(Long dishId);

    List<RecipeItemResponse> updateRecipe(Long dishId, RecipeUpdateRequest request);

    DishAvailabilityResponse getDishAvailability(Long dishId);
}
