package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.responses.recipe.DishAvailabilityResponse;
import com.luxe_restaurant.domain.entities.Dish;
import com.luxe_restaurant.domain.entities.Ingredient;
import com.luxe_restaurant.domain.entities.InventoryStock;
import com.luxe_restaurant.domain.entities.MenuItemIngredient;
import com.luxe_restaurant.domain.enums.IngredientUnit;
import com.luxe_restaurant.domain.repositories.DishRepository;
import com.luxe_restaurant.domain.repositories.IngredientRepository;
import com.luxe_restaurant.domain.repositories.InventoryStockRepository;
import com.luxe_restaurant.domain.repositories.MenuItemIngredientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RecipeServiceImplTest {

    private MenuItemIngredientRepository menuItemIngredientRepository;
    private DishRepository dishRepository;
    private IngredientRepository ingredientRepository;
    private InventoryStockRepository inventoryStockRepository;
    private RecipeServiceImpl recipeService;

    @BeforeEach
    void setUp() {
        menuItemIngredientRepository = mock(MenuItemIngredientRepository.class);
        dishRepository = mock(DishRepository.class);
        ingredientRepository = mock(IngredientRepository.class);
        inventoryStockRepository = mock(InventoryStockRepository.class);

        recipeService = new RecipeServiceImpl(
                menuItemIngredientRepository,
                dishRepository,
                ingredientRepository,
                inventoryStockRepository
        );
    }

    @Test
    @DisplayName("Tính số suất ăn tối đa (availableServings) dựa vào tồn kho hiện tại")
    void testGetDishAvailability_Success() {
        Dish dish = new Dish();
        dish.setId(1L);
        dish.setNameDish("Bò Bit Tet");

        Ingredient thitBo = Ingredient.builder().id(10L).code("ING01").name("Thịt Bò").baseUnit(IngredientUnit.GRAM).build();
        Ingredient sotBo = Ingredient.builder().id(11L).code("ING02").name("Sốt Bơ").baseUnit(IngredientUnit.MILLILITER).build();

        MenuItemIngredient item1 = MenuItemIngredient.builder().dish(dish).ingredient(thitBo).quantity(new BigDecimal("200")).build(); // 200g
        MenuItemIngredient item2 = MenuItemIngredient.builder().dish(dish).ingredient(sotBo).quantity(new BigDecimal("50")).build();  // 50ml

        when(dishRepository.findById(1L)).thenReturn(Optional.of(dish));
        when(menuItemIngredientRepository.findByDishIdWithIngredient(1L)).thenReturn(List.of(item1, item2));

        // Tồn kho: Thịt bò = 1000g (được 5 suất), Sốt = 150ml (được 3 suất) -> Tối đa 3 suất
        when(inventoryStockRepository.findByIngredientId(10L)).thenReturn(Optional.of(
                InventoryStock.builder().ingredient(thitBo).quantityOnHand(new BigDecimal("1000")).build()
        ));
        when(inventoryStockRepository.findByIngredientId(11L)).thenReturn(Optional.of(
                InventoryStock.builder().ingredient(sotBo).quantityOnHand(new BigDecimal("150")).build()
        ));

        DishAvailabilityResponse response = recipeService.getDishAvailability(1L);

        assertEquals(1L, response.getDishId());
        assertEquals("AVAILABLE", response.getStatus());
        assertEquals(3L, response.getAvailableServings());
        assertTrue(response.getMissingIngredients().isEmpty());
    }
}
