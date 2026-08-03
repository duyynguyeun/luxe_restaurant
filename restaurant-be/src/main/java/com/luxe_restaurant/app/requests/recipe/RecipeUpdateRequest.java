package com.luxe_restaurant.app.requests.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RecipeUpdateRequest {

    @NotNull(message = "Danh sách nguyên liệu công thức không được null")
    @Valid
    private List<RecipeItemRequest> items;
}
