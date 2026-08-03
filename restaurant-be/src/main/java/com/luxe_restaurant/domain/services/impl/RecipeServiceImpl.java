package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.recipe.RecipeItemRequest;
import com.luxe_restaurant.app.requests.recipe.RecipeUpdateRequest;
import com.luxe_restaurant.app.responses.recipe.DishAvailabilityResponse;
import com.luxe_restaurant.app.responses.recipe.RecipeItemResponse;
import com.luxe_restaurant.domain.entities.Dish;
import com.luxe_restaurant.domain.entities.Ingredient;
import com.luxe_restaurant.domain.entities.InventoryStock;
import com.luxe_restaurant.domain.entities.MenuItemIngredient;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.exception.ErrorCode;
import com.luxe_restaurant.domain.exception.NotFoundException;
import com.luxe_restaurant.domain.repositories.DishRepository;
import com.luxe_restaurant.domain.repositories.IngredientRepository;
import com.luxe_restaurant.domain.repositories.InventoryStockRepository;
import com.luxe_restaurant.domain.repositories.MenuItemIngredientRepository;
import com.luxe_restaurant.domain.services.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecipeServiceImpl implements RecipeService {

    private final MenuItemIngredientRepository menuItemIngredientRepository;
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final InventoryStockRepository inventoryStockRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RecipeItemResponse> getRecipeByDishId(Long dishId) {
        if (!dishRepository.existsById(dishId)) {
            throw new NotFoundException(ErrorCode.DISH_001);
        }
        List<MenuItemIngredient> items = menuItemIngredientRepository.findByDishIdWithIngredient(dishId);
        return items.stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional
    public List<RecipeItemResponse> updateRecipe(Long dishId, RecipeUpdateRequest request) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.DISH_001));

        if (request.getItems() == null) {
            throw new BusinessException(ErrorCode.SYS_002, "Danh sách nguyên liệu không được null");
        }

        // Validate không trùng lặp ingredientId trong cùng 1 request
        Set<Long> seenIngredientIds = new HashSet<>();
        for (RecipeItemRequest item : request.getItems()) {
            if (!seenIngredientIds.add(item.getIngredientId())) {
                throw new BusinessException(ErrorCode.DUPLICATE_RECIPE_INGREDIENT);
            }
            if (item.getQuantity() == null || item.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessException(ErrorCode.INVALID_QUANTITY);
            }
        }

        // Xóa công thức cũ
        menuItemIngredientRepository.deleteByDishId(dishId);

        List<MenuItemIngredient> newItems = new ArrayList<>();
        for (RecipeItemRequest itemReq : request.getItems()) {
            Ingredient ingredient = ingredientRepository.findById(itemReq.getIngredientId())
                    .orElseThrow(() -> new NotFoundException(ErrorCode.INGREDIENT_001));

            if (!ingredient.isActive()) {
                throw new BusinessException(ErrorCode.INGREDIENT_003,
                        "Nguyên liệu '" + ingredient.getName() + "' hiện đang không hoạt động");
            }

            MenuItemIngredient menuItemIngredient = MenuItemIngredient.builder()
                    .dish(dish)
                    .ingredient(ingredient)
                    .quantity(itemReq.getQuantity())
                    .note(itemReq.getNote())
                    .build();

            newItems.add(menuItemIngredient);
        }

        List<MenuItemIngredient> savedItems = menuItemIngredientRepository.saveAll(newItems);
        return savedItems.stream().map(this::mapToResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DishAvailabilityResponse getDishAvailability(Long dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.DISH_001));

        List<MenuItemIngredient> recipeItems = menuItemIngredientRepository.findByDishIdWithIngredient(dishId);

        if (recipeItems.isEmpty()) {
            return DishAvailabilityResponse.builder()
                    .dishId(dish.getId())
                    .dishName(dish.getNameDish())
                    .availableServings(0)
                    .status("RECIPE_NOT_CONFIGURED")
                    .missingIngredients(Collections.emptyList())
                    .build();
        }

        long minServings = Long.MAX_VALUE;
        List<DishAvailabilityResponse.MissingIngredientDetail> missingList = new ArrayList<>();

        for (MenuItemIngredient item : recipeItems) {
            Ingredient ingredient = item.getIngredient();
            BigDecimal recipeQty = item.getQuantity();

            InventoryStock stock = inventoryStockRepository.findByIngredientId(ingredient.getId()).orElse(null);
            BigDecimal stockQty = stock != null ? stock.getQuantityOnHand() : BigDecimal.ZERO;

            if (stockQty.compareTo(recipeQty) < 0) {
                missingList.add(DishAvailabilityResponse.MissingIngredientDetail.builder()
                        .ingredientId(ingredient.getId())
                        .ingredientCode(ingredient.getCode())
                        .ingredientName(ingredient.getName())
                        .requiredQuantity(recipeQty)
                        .availableQuantity(stockQty)
                        .baseUnit(ingredient.getBaseUnit())
                        .build());
                minServings = 0;
            } else {
                long possibleServings = stockQty.divide(recipeQty, 0, RoundingMode.FLOOR).longValue();
                if (possibleServings < minServings) {
                    minServings = possibleServings;
                }
            }
        }

        if (minServings == Long.MAX_VALUE) {
            minServings = 0;
        }

        String status = (minServings > 0) ? "AVAILABLE" : "OUT_OF_STOCK";

        return DishAvailabilityResponse.builder()
                .dishId(dish.getId())
                .dishName(dish.getNameDish())
                .availableServings(minServings)
                .status(status)
                .missingIngredients(missingList)
                .build();
    }

    private RecipeItemResponse mapToResponse(MenuItemIngredient item) {
        Ingredient ingredient = item.getIngredient();
        InventoryStock stock = inventoryStockRepository.findByIngredientId(ingredient.getId()).orElse(null);
        BigDecimal avgCost = stock != null ? stock.getAverageCost() : BigDecimal.ZERO;
        BigDecimal estimatedCost = item.getQuantity().multiply(avgCost);

        return RecipeItemResponse.builder()
                .id(item.getId())
                .ingredientId(ingredient.getId())
                .ingredientCode(ingredient.getCode())
                .ingredientName(ingredient.getName())
                .baseUnit(ingredient.getBaseUnit())
                .quantity(item.getQuantity())
                .note(item.getNote())
                .averageCost(avgCost)
                .estimatedCost(estimatedCost)
                .build();
    }
}
