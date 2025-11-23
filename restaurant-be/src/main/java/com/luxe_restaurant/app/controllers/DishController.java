package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.dish.DishRequest;
import com.luxe_restaurant.app.responses.dish.DishResponse;
import com.luxe_restaurant.domain.services.DishService;
import lombok.RequiredArgsConstructor;

// <-- 1. THÊM DÒNG NÀY
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // <-- 2. THÊM DÒNG NÀY
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
    public List<DishResponse> getAllDishes(){
        return dishService.getAllDishes();
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
    // --- BẠN CẦN ĐẢM BẢO CÓ ĐOẠN NÀY ---
    @PutMapping("/toggle/{id}")
    public DishResponse toggleDish(@PathVariable Long id) {
        return dishService.toggleDishStatus(id);
    }
}
