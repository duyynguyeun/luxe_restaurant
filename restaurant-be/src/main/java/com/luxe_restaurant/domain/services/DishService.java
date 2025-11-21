package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.dish.DishRequest;
import com.luxe_restaurant.app.responses.dish.DishResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface DishService {
    DishResponse createDish(@RequestBody DishRequest dishRequest);
    List<DishResponse> getAllDishes();
    DishResponse updateDish(@PathVariable Long id, @RequestBody DishRequest dishRequest);
    void deleteDish(@PathVariable Long id);
    DishResponse getDishById(@PathVariable Long id);
    // --- BẠN ĐANG THIẾU DÒNG NÀY ---
    DishResponse toggleDishStatus(Long id);
}
