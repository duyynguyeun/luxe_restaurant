package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.ingredient.IngredientRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.services.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @GetMapping
    public PageResponse<IngredientResponse> filterIngredients(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        return ingredientService.filterIngredients(keyword, active, pageable);
    }

    @GetMapping("/low-stock")
    public List<IngredientResponse> getLowStockIngredients() {
        return ingredientService.getLowStockIngredients();
    }

    @GetMapping("/{id}")
    public IngredientResponse getIngredientById(@PathVariable Long id) {
        return ingredientService.getIngredientById(id);
    }

    @PostMapping
    public IngredientResponse createIngredient(@Valid @RequestBody IngredientRequest request) {
        return ingredientService.createIngredient(request);
    }

    @PutMapping("/{id}")
    public IngredientResponse updateIngredient(@PathVariable Long id, @Valid @RequestBody IngredientRequest request) {
        return ingredientService.updateIngredient(id, request);
    }

    @PatchMapping("/{id}/status")
    public IngredientResponse toggleIngredientStatus(@PathVariable Long id) {
        return ingredientService.toggleIngredientStatus(id);
    }
}
