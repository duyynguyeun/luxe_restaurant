package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.dish.DishRequest;
import com.luxe_restaurant.app.responses.dish.DishResponse;
import com.luxe_restaurant.domain.services.DishService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/dish")
@RequiredArgsConstructor
public class DishController {

    private final DishService dishService;

    @PostMapping("/create")
    public DishResponse createDish(@RequestBody DishRequest dishRequest){
        return dishService.createDish(dishRequest);
    }

    @GetMapping("/getall")
    public com.luxe_restaurant.app.responses.page.PageResponse<DishResponse> getAllDishes(
            @org.springframework.data.web.PageableDefault(size = 1000, page = 0) org.springframework.data.domain.Pageable pageable){
        return new com.luxe_restaurant.app.responses.page.PageResponse<>(dishService.getAllDishes(pageable));
    }

    @PutMapping("/update/{id}")
    public DishResponse updateDish(@PathVariable Long id, @RequestBody DishRequest dishRequest){
        return dishService.updateDish(id, dishRequest);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDish(@PathVariable Long id){
        dishService.deleteDish(id);
    }

    @GetMapping("/find/{id}")
    public DishResponse findDish(@PathVariable Long id){
        return dishService.getDishById(id);
    }

    @PutMapping("/toggle/{id}")
    public DishResponse toggleDish(@PathVariable Long id) {
        return dishService.toggleDishStatus(id);
    }
}
