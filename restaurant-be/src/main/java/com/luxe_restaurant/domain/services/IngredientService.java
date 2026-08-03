package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.ingredient.IngredientRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IngredientService {

    IngredientResponse createIngredient(IngredientRequest request);

    IngredientResponse updateIngredient(Long id, IngredientRequest request);

    IngredientResponse toggleIngredientStatus(Long id);

    IngredientResponse getIngredientById(Long id);

    PageResponse<IngredientResponse> filterIngredients(String keyword, Boolean active, Pageable pageable);

    List<IngredientResponse> getLowStockIngredients();
}
